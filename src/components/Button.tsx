import React from "react";

type buttonProps = {
    children: React.ReactNode;
    disabled?: boolean;
    danger?: boolean;
    secondary?: boolean;
    transparent?: boolean;
    onClick?: () => void;
    full?: boolean;
    type?: "submit" | "reset";
};

const Button = ({
    full,
    children,
    danger,
    transparent,
    disabled,
    secondary,
    onClick,
    type,
}: buttonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
            text-white px-4 py-2 rounded-md
             
    ${full ? "w-full" : "w-fit"}
    ${danger && "bg-rose-600"}
    ${transparent && "bg-transparent text-black"}
    ${disabled && "opacity-50"}
    ${!danger && !secondary && "bg-sky-600"}
    ${secondary && "bg-green-600"}
    
    `}
        >
            {children}
        </button>
    );
};

export default Button;
