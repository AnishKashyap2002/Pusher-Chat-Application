import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import userImage from "../../public/user.jpeg";

interface AvatarGroupProps {
    users: User[];
}

const AvatarGroup = ({ users = [] }: AvatarGroupProps) => {
    const slicedUsers = users.slice(0, 3);

    const position = {
        0: "top-0 left-[12px]",
        1: "bottom-0",
        2: "bottom-0 right-0",
    };
    return (
        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div
                    className={`
        absolute inline-block rounded-full overflow-hidden h-[21px]
        w-[21px] ${position[index as keyof typeof position]}
        `}
                    key={user.id}
                >
                    <Image
                        alt="avatar"
                        fill
                        src={(user?.image as string) || userImage}
                    />
                </div>
            ))}
        </div>
    );
};

export default AvatarGroup;
