import bcrypt from "bcrypt";

import prisma from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { email, name, password } = body;

        if (!email || !name || !password) {
            // here new is required because we are not using the .json()
            return new NextResponse("Missing info", { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log(error, "registration error");
        return new NextResponse("Internal Error", { status: 400 });
    }
}
