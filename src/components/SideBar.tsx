import React, { ReactNode } from "react";
import DesktopSideBar from "./DesktopSideBar";
import MobileFooter from "./MobileFooter";

import getCurrentuser from "@/actions/getCurrentUser";

export default async function SideBar({ children }: { children: ReactNode }) {
    const currentUser = await getCurrentuser();

    return (
        <div className="flex h-screen w-full">
            {/* ! used at the end so that user can be null */}
            <DesktopSideBar currentUser={currentUser!} />
            <MobileFooter currentUser={currentUser!} />
            <main className="relative h-full w-full">
                <div className="h-full w-full">{children}</div>
            </main>
        </div>
    );
}
