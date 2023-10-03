"use client";

import { FullMessageType } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import format from "date-fns/format";
import Image from "next/image";
import axios from "axios";
import useConversation from "@/hooks/useConversation";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox = ({ data, isLast }: MessageBoxProps) => {
    const session = useSession();

    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data.sender.email)
        .map((user) => user.name)
        .join(",");

    const { conversationId } = useConversation();

    // useEffect(() => {
    //     axios.post(`/api/conversations/${conversationId}/seen`);
    // });

    const container = `flex gap-2 p-4 ${isOwn && "justify-end"}`;

    const body = `flex flex-col gap-2 ${isOwn && "items-end"}`;

    const avatar = `${isOwn && "order-2"}`;

    const message = `text-sm w-fit overflow-hidden ${
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100"
    }
        ${data.image ? "rounded-md p-0" : "rounded-full py-2 px-2"}`;

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500 ">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="image"
                            height="288"
                            width={288}
                            src={data.image}
                            className="object-cover transition hover:scale-110 duration-200 translate"
                        />
                    ) : (
                        <div className="">{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`Seen by  ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBox;
