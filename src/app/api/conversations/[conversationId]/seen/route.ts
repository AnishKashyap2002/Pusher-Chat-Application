import getCurrentuser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";
import { pusherServer } from "@/libs/pusher";

interface IParams {
    conversationId: string;
}

// make sure params is the second parameter
export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentuser();

        const { conversationId } = params;
        if (!currentUser?.id && !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //find the existing conversation
        // console.log(conversationId, "conversation id");
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Invalid Id", { status: 400 });
        }
        const lastMessage =
            conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json({});
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });
        await pusherServer
            .trigger(currentUser.email!, "conversation:update", {
                id: conversationId,
                messages: [updatedMessage],
            })
            .catch((err) => {
                console.error(
                    "Pusher trigger Conversation update:",
                    err + " " + updatedMessage
                );
            });

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(updatedMessage);
        }

        await pusherServer
            .trigger(conversationId!, "messages:update", updatedMessage)
            .catch((err) => {
                console.error("Pusher trigger Messages update:", err);
            });

        return NextResponse.json(updatedMessage);

        // return NextResponse.json({ message: "success" });
    } catch (error) {
        console.log(error, "error message seen");

        return new NextResponse("Internal Error", { status: 500 });
    }
}
