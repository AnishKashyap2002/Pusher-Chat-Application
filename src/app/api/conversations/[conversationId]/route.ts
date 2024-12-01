import getCurrentuser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";
import { pusherServer } from "@/libs/pusher";
import zlib from "zlib";

interface IParams {
    conversationId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentuser();

        if (!currentUser?.id || !currentUser.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });
        if (!existingConversation) {
            return new NextResponse("Invalid Id", { status: 400 });
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });
        const compressedData = zlib.gzipSync(
            JSON.stringify(existingConversation)
        );
        const base64Data = compressedData.toString("base64"); // Convert to Base64

        // Send compressed data via Pusher
        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    "conversation:remove",
                    base64Data // Send compressed message
                );
            }
        });
        //delete the conversation record
        const updateUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                conversations: {
                    disconnect: {
                        id: conversationId,
                    },
                },
            },
        });

        return NextResponse.json(deleteConversation);
    } catch (error) {
        console.log(error, "Error Converstaion delete");
        return new NextResponse("Internal error", { status: 500 });
    }
}
