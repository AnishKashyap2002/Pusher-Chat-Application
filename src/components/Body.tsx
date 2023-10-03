"use client";

import useConversation from "@/hooks/useConversation";
import { FullMessageType } from "@/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    intialMessages: FullMessageType[];
}

export default function Body({ intialMessages }: BodyProps) {
    const [messages, setMessages] = useState(intialMessages);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        // console.log("Request made");
        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message];
            });
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        };
        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }
                    return currentMessage;
                })
            );
        };
        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("messages:update", updateMessageHandler);
        bottomRef?.current?.scrollIntoView();
        return () => {
            pusherClient.unbind("messages:update", updateMessageHandler);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unsubscribe(conversationId);
        };
    }, []);

    return (
        <div className="flex-1 overflow-y-auto h-full">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div
                className="pt-2"
                ref={bottomRef}
            >
                .
            </div>
        </div>
    );
}
