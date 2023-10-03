import prisma from "@/libs/prismaDb";

import getCurrentuser from "./getCurrentUser";

const getConversations = async () => {
    const currentUser = await getCurrentuser();

    if (!currentUser) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc",
            },
            where: {
                userIds: {
                    has: currentUser.id,
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true,
                    },
                },
            },
        });
        return conversations;
    } catch (error) {
        return [];
    }
};

export default getConversations;
