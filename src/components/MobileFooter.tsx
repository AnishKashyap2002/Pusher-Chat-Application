"use client";

import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes";
import React, { useState } from "react";
import MobileItem from "./MobileItem";
import { User } from "@prisma/client";
import Avatar from "./Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSideBarProps {
    currentUser: User;
}

export default function MobileFooter({ currentUser }: DesktopSideBarProps) {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="z-40 lg:hidden fixed bottom-0 bg-white flex justify-between items-center w-full px-5">
                {routes.map((route) => (
                    <MobileItem
                        key={route.href}
                        href={route.href}
                        label={route.label}
                        icon={route.icon}
                        active={route.active}
                        onClick={route.onClick}
                    />
                ))}
                <nav className=" flex ">
                    <div
                        className="py-2 pl-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Avatar user={currentUser} />
                    </div>
                </nav>
            </div>
        </>
    );
}
