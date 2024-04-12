"use client";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import Avatar from "./Avatar";
import LoadingModal from "./LoadingModal";

export default function UserBox({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // useCallback:  It memoises the function to prevent unnecessary re-renders
    const handleClick = useCallback(() => {
        setLoading(true);
        axios
            .post("/api/conversations", { userId: user.id })
            .then((data) => {
                console.log(data);
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setLoading(false));
    }, [user, router]);

    return (
        <>
            {loading && <LoadingModal />}
            <div
                className="flex  gap-2 items-center
            hover:bg-gray-200 cursor-pointer
             relative pr-4  py-2 z-50
            "
                onClick={handleClick}
            >
                <Avatar user={user} />
                <span>{user.name}</span>
            </div>
        </>
    );
}
