"use client";

import useConversation from "@/hooks/useConversation";
import EmptyState from "@/components/EmptyState";

const Home = () => {
    const { isOpen } = useConversation();

    return (
        <div
            className={`lg:ml-80 absolute -z-30 lg:w-[700px] h-full lg:block
            ${isOpen ? "block" : "hidden"}`}
        >
            <EmptyState />
        </div>
    );
};

export default Home;
