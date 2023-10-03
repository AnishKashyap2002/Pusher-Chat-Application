"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import userImage from "../../public/user.jpeg";
import useActiveList from "@/hooks/useActiveList";

interface AvatarProps {
    user: User;
}
export default function Avatar({ user }: AvatarProps) {
    const { members } = useActiveList();
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className="relative w-fit cursor-pointer">
            <div className="relative rounded-full h-9 w-9 overflow-hidden">
                <Image
                    src={user?.image || userImage}
                    alt="User Image"
                    fill
                    className="object-cover"
                />
            </div>
            {isActive && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full  ring-2  ring-white  " />
            )}
        </div>
    );
}
