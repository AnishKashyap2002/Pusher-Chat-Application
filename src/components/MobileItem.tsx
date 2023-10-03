import Link from "next/link";
import React from "react";

interface MobileItemProps {
    label: string;
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
}
export default function MobileItem({
    label,
    icon: Icon,
    href,
    active,
    onClick,
}: MobileItemProps) {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };
    return (
        <li
            onClick={handleClick}
            className="list-none flex-1 justify-center flex"
        >
            <Link
                href={href}
                className={`
                flex items-center
                w-full
                py-3
                justify-center
                text-gray-500 text-sm hover:text-black hover:bg-gray-100
               rounded-md
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
