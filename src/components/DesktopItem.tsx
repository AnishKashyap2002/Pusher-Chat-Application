"use client";
import React from "react";
import Link from "next/link";

interface DesktopItemProps {
    label: string;
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
}
export default function DesktopItem({
    label,
    icon: Icon,
    onClick,
    active,
    href,
}: DesktopItemProps) {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };
    return (
        <li
            className=""
            onClick={handleClick}
        >
            <Link
                href={href}
                className={`
                flex items-center gap-2
                mb-2
                text-gray-500 text-sm hover:text-black hover:bg-gray-100
                p-3 rounded-md
                ${active && "bg-gray-100 text-black"}
                `}
            >
                <Icon className="h-6 w-6 shrink-0" />

                {/* The sr-only class hides the label but screen readers can see it for better seo */}

                <span className="sr-only">{label}</span>
            </Link>
        </li>
    );
}
