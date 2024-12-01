import getCurrentuser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";
import { pusherServer } from "@/libs/pusher";

import zlib from "zlib";

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

        const compressedMessage = zlib.gzipSync(JSON.stringify(newMessage));
        const base64Message = compressedMessage.toString("base64");

        console.log("This is the newMessage", newMessage);

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
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

        await pusherServer
            .trigger(conversationId, "messages:new", base64Message)
            .catch((err) => {
                console.error("Pusher trigger Message new:", err);
                console.log("Payload to Pusher:", base64Message);

                console.log(
                    "Payload Size:",
                    Buffer.byteLength(JSON.stringify(base64Message)),
                    "bytes"
                );
            });
        console.log("Payload to Pusher:", newMessage);

        console.log(
            "Payload Size:",
            Buffer.byteLength(JSON.stringify(newMessage)),
            "bytes"
        );

        const lastMessage =
            updatedConversation.messages[
                updatedConversation.messages.length - 1
            ];

        if (!lastMessage) {
            return NextResponse.json({});
        }

        // updatedConversation.users.map((user) => {
        //     pusherServer
        //         .trigger(user.email!, "conversation:update", {
        //             id: conversationId,
        //             messages: [lastMessage],
        //         })
        //         .catch((err) => {
        //             console.error("Pusher trigger Conversation Update:", err);
        //         });
        // });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {
            status: 500,
        });
    }
}
