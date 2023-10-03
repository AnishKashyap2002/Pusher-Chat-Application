import React, { ReactNode } from "react";
import SideBar from "@/components/SideBar";
import getUsers from "@/actions/getUsers";
import UserList from "@/components/UserList";
import AuthContext from "@/context/AuthContext";

export default async function UsersLayout({
    children,
}: {
    children: ReactNode;
}) {
    const users = await getUsers();

    return (
        <AuthContext>
            <SideBar>
                <UserList users={users} />
                {children}
            </SideBar>
        </AuthContext>
    );
}
