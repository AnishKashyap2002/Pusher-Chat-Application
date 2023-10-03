"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface authContextProps {
    children: ReactNode;
}

export default function AuthContext({ children }: authContextProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
