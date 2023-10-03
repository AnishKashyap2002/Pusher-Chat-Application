import prisma from "@/libs/prismaDb";

import { NextResponse } from "next/server";
import getCurrentuser from "@/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentuser();
        const body = await request.json();
        const { userId, isGroup, members, name } = body;
        console.log(body);

        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }

        if (isGroup && (!members || members?.length < 2 || !name)) {
            return new NextResponse("Inalid Data", { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup: isGroup,
                    users: {
                        // check this connect here
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),
                            {
                                id: currentUser.id,
                            },
                        ],
                    },
                },
                include: {
                    users: true,
                },
            });

            // console.log(newConversation);
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(
                        user.email,
                        "conversation:new",
                        newConversation
                    );
                }
            });
            return NextResponse.json(newConversation);
        }

        const existingConversation = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [userId, currentUser.id],
                        },
                    },
                    {
                        userIds: {
                            equals: [currentUser.id, userId],
                        },
                    },
                ],
            },
        });

        const singleConversation = existingConversation[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    "conversation:new",
                    newConversation
                );
            }
        });

        return NextResponse.json(newConversation);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
