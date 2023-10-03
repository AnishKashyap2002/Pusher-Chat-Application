import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    placeholder?: string;
    type?: string;
    id: string;
    required?: boolean;
    errors: FieldErrors;
    register: UseFormRegister<FieldValues>;
}

export default function MessageInput({
    placeholder,
    type,
    id,
    register,
    required,
    errors,
}: MessageInputProps) {
    return (
        <div className="relative w-full ">
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                autoComplete={id}
                id={id}
                {...register(id, { required: true })}
                className="outline-none px-4 py-2 text-black font-light bg-gray-100 w-full rounded-full"
            />
        </div>
    );
}
