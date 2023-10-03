import getConversationsById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import Body from "@/components/Body";
import EmptyState from "@/components/EmptyState";
import Form from "@/components/Form";
import Header from "@/components/Header";
import React from "react";

interface Params {
    conversationId: string;
}

export default async function ConversationId({ params }: { params: Params }) {
    const conversation = await getConversationsById(params.conversationId);

    const messages = await getMessages(params.conversationId);
    // console.log("The conversation messages are: ", messages);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }
    return (
        <div className="lg:pl-80 h-full">
            <div className="flex flex-col h-full w-full">
                <Header conversation={conversation} />
                <Body intialMessages={messages} />
                <Form />
            </div>
        </div>
    );
}
