import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";

interface UserListProps {
    users: User[];
}

export default function UserList({ users }: UserListProps) {
    return (
        <div
            className=" fixed
         lg:left-20 lg:w-80
         overflow-auto
    bg-gray-100 h-full w-full z-30 pb-20"
        >
            <div className="px-4 py-2 flex flex-col flex-1 gap-2">
                <h1 className="text-lg font-bold ">People</h1>
                <div className="flex flex-col gap-1 mt-2 ">
                    {users.map((user) => (
                        <UserBox
                            key={user.email}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
