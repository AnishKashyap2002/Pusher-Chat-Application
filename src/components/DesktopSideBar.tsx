"use client";
import { useState } from "react";
import useRoutes from "@/hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "./Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSideBarProps {
    currentUser: User;
}

export default function DesktopSideBar({ currentUser }: DesktopSideBarProps) {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    console.log(currentUser);

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="hidden lg:fixed  lg:flex justify-between flex-col h-full lg:z-40 lg:overflow-auto">
                <nav>
                    <ul role="list">
                        {routes.map((item) => (
                            <DesktopItem
                                key={item.label}
                                href={item.href}
                                icon={item.icon}
                                active={item.active}
                                label={item.label}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </nav>
                <nav className="mt-4 flex ">
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
