import prisma from "@/libs/prismaDb";

import getCurrentuser from "./getCurrentUser";

const getConversationsById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentuser();
        if (!currentUser?.email) {
            return null;
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        return conversation;
    } catch (error) {
        return null;
    }
};

export default getConversationsById;
