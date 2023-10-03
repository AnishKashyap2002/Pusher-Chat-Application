"use client";

import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes";
import React from "react";
import MobileItem from "./MobileItem";

export default function MobileFooter() {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    if (isOpen) {
        return null;
    }
    return (
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
        </div>
    );
}
