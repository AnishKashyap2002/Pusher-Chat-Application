"use client";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import Avatar from "./Avatar";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "./AvatarGroup";
import useActiveList from "@/hooks/useActiveList";
interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

export default function Header({ conversation }: HeaderProps) {
    const otherUser = useOtherUser(conversation);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const { members } = useActiveList();

    const isActive = members.indexOf(otherUser.email!) !== -1;

    const status = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }
        return isActive ? "Active" : "Offline";
    }, [conversation, isActive]);

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className="flex px-2 justify-between items-center w-full bg-white shadow-sm py-2">
                <div className="flex items-center gap-3 ">
                    <Link
                        href={"/conversations"}
                        className="lg:hidden"
                    >
                        <HiChevronLeft size={32} />
                    </Link>

                    <div className="flex flex-col">
                        {conversation.isGroup ? (
                            <AvatarGroup users={conversation.users} />
                        ) : (
                            <Avatar user={otherUser} />
                        )}
                        <div className="">
                            {conversation?.name || otherUser?.name}
                        </div>
                        <div className="text-xs opacity-75">{status}</div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => {
                        console.log("It is open");
                        return setDrawerOpen(true);
                    }}
                    className={
                        "text-sky-500  cursor-pointer hover:text-sky-600"
                    }
                />
            </div>
        </>
    );
}
