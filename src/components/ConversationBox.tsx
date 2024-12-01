"use client";

import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import useOtherUser from "@/hooks/useOtherUser";
import { useCallback, useMemo } from "react";
import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean;
}

export default function ConversationBox({
    data,
    selected,
}: ConversationBoxProps) {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    // console.log(data);

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];
        return messages[messages.length - 1];
    }, [data.messages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        } else {
            const seenArray = lastMessage.seen || [];
            if (!userEmail) {
                return false;
            }
            return (
                seenArray.filter((user) => userEmail == userEmail).length !== 0
            );
        }
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return "Sent an image";
        }
        if (lastMessage?.body) {
            return lastMessage.body;
        }
        return "Started a conversation";
    }, [lastMessage]);

    return (
        <div
            className={`w-full hover:bg-gray-100 text-sm
        rounded-lg  py-2 cursor-pointer ${
            selected ? "bg-gray-200" : "bg-white"
        } flex items-center gap-2
        `}
            onClick={handleClick}
        >
            {data.isGroup ? (
                <AvatarGroup users={data.users} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="flex flex-col">
                <div className=" flex justify-between items-center w-full">
                    <p>{data?.name || otherUser?.name}</p>
                    {lastMessage?.createdAt && (
                        <p className="opacity-75">
                            {format(new Date(lastMessage?.createdAt), "p")}
                        </p>
                    )}
                </div>
                <p className="text-xs opacity-75">{lastMessageText}</p>
            </div>
        </div>
    );
}
