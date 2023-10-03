import getCurrentuser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentuser();
        const body = await request.json();

        const { name, image } = body;

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                image,
                name,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log(error, "Settings Error");
        return new NextResponse("Inernal Error", { status: 500 });
    }
}
