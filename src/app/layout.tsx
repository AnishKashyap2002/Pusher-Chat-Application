import ToasterContext from "@/context/ToasterContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthContext from "@/context/AuthContext";
import ActiveStatus from "@/components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chatify Application",
    description: "Chat with your friends and make different groups..",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="icon"
                    href="/favicon.png"
                />
            </head>
            <body className={inter.className}>
                <AuthContext>
                    <ActiveStatus />
                    {children}
                    <ToasterContext />
                </AuthContext>
            </body>
        </html>
    );
}
