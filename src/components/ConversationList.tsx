"use client";

import { Conversation, Message, User } from "@prisma/client";
import { MdOutlineGroupAdd } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FullConversationType, FullMessageType } from "@/types";
import { useRouter } from "next/navigation";
import useConversation from "@/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";
import pako from "pako";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

export default function ConversationList({
    initialItems,
    users,
}: ConversationListProps) {
    const [items, setItems] = useState(initialItems);
    const [forceUpdate, setForceUpdate] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const session = useSession();
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email;
    }, [session.data?.user?.email]);

    const updateState = (conversation: FullConversationType) => {
        setItems((current) => {
            const updatedConversations = current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: [...conversation.messages],
                    };
                }
                return currentConversation;
            });
            return updatedConversations;
        });
    };

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [...current, conversation];
            });
        };

        const updateHandler = (compressedBase64Conv: string) => {
            console.log("Conversation update triggered");

            const binaryString = atob(compressedBase64Conv);
            const binaryData = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                binaryData[i] = binaryString.charCodeAt(i);
            }

            // Decompress the binary data
            const decompressedData = pako.ungzip(binaryData, {
                to: "string",
            });

            // Parse the decompressed JSON
            const conversation = JSON.parse(decompressedData);
            updateState(conversation);

            console.log(items);
        };

        const removeHandler = (compressedBase64Data: string) => {
            try {
                // Decode Base64 into a binary string
                const binaryString = atob(compressedBase64Data);
                const binaryData = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    binaryData[i] = binaryString.charCodeAt(i);
                }

                // Decompress the binary data
                const decompressedData = pako.ungzip(binaryData, {
                    to: "string",
                });

                // Parse the decompressed JSON
                const conversation = JSON.parse(decompressedData);

                // Call the remove handler with decompressed conversation
                removeHandler(conversation);
            } catch (error) {
                console.error("Decompression failed:", error);
            }
        };

        pusherClient.subscribe(pusherKey);
        pusherClient.bind("conversation:new", newHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:remove", removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", newHandler);
            pusherClient.unbind("coversation:update", updateHandler);
            pusherClient.unbind("conversation:remove", removeHandler);
        };
    }, [pusherKey]);

    return (
        <>
            <GroupChatModal
                isOpen={isModalOpen}
                users={users}
                onClose={() => setIsModalOpen(false)}
            />
            <aside
                className={`  lg:block fixed lg:left-12 lg:w-60 overflow-y-scroll h-screen  lg:z-50  z-20 pb-32
        ${isOpen ? "" : "block w-full left-0"}
        `}
            >
                <div className="px-5">
                    <div className="flex justify-between items-center font-bold text-black">
                        <h1>Messages</h1>
                        <div
                            className="cursor-pointer bg-gray-100 text-gray-800 "
                            onClick={() => setIsModalOpen(true)}
                        >
                            <MdOutlineGroupAdd />
                        </div>
                    </div>
                    <div className="">
                        {items.map((item) => (
                            <ConversationBox
                                key={item.id}
                                data={item}
                                selected={conversationId === item.id}
                            />
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
