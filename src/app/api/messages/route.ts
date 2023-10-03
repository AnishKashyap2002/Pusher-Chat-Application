import getCurrentuser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";
import { pusherServer } from "@/libs/pusher";

export async function POST(request: Request) {
    // console.log(request.credentials);
    try {
        const currentUser = await getCurrentuser();

        const body = await request.json();
        const { message, image, conversationId } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                // there is no need to include converstation Id
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    },
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            include: {
                seen: true,
                sender: true,
            },
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                // messages: {
                //     connect: {
                //         id: newMessage.id,
                //     },
                // },
                messages: {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        // console.log("This is the new message", updatedConversation.messages);

        await pusherServer.trigger(conversationId, "messages:new", newMessage);
        console.log("This thing is triggered bitch", conversationId);

        const lastMessage =
            updatedConversation.messages[
                updatedConversation.messages.length - 1
            ];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage],
            });
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {
            status: 500,
        });
    }
}
