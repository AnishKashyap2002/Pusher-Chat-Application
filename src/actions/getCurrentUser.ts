import prisma from "@/libs/prismaDb";

import getSession from "./getSession";

const getCurrentuser = async () => {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });
        if (!currentUser) {
            return null;
        }
        return currentUser;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default getCurrentuser;
