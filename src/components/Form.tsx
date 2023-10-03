"use client";

import useConversation from "@/hooks/useConversation";
import axios from "axios";
import React, { KeyboardEventHandler } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { HiMiniPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";
import { CldUploadButton } from "next-cloudinary";
import toast from "react-hot-toast";

export default function Form() {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,

        formState: { errors },
    } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(data);
        setValue("message", "", {
            shouldValidate: true,
        });
        // axios
        //     .post("/api/messages", {
        //         ...data,
        //         conversationId,
        //     })
        //     .then((data) => {
        //         console.log(data.data, "This is the return of the api message");
        //     });
        fetch("/api/messages", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                conversationId,
            }),
        }).then(() => {
            toast.success("Messaged Successfully");
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key == "Enter") {
            handleSubmit(onSubmit);
        }
    };

    const handleUPload = (result: any) => {
        axios.post("/api/messages", {
            image: result?.info?.secure_url,
            conversationId,
        });
    };

    return (
        <div className="py-4 px-4 bg-white flex items-center gap-2 w-full h-fit">
            <CldUploadButton
                options={{
                    maxFiles: 1,
                }}
                uploadPreset="s0suaub8"
                onUpload={handleUPload}
            >
                <HiPhoto
                    size={30}
                    className={"bg-sky-500 text-white"}
                />
            </CldUploadButton>
            <form
                className="flex-1 flex items-center   lg:gap-4 gap-2 w-full"
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit(onSubmit)}
            >
                <MessageInput
                    type="text"
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder={"Write a message"}
                />
                <button
                    type="submit"
                    className="p-2 rounded-full bg-sky-400 hover:bg-sky-600 transition"
                >
                    <HiMiniPaperAirplane
                        size={18}
                        className={"text-white"}
                    />
                </button>
            </form>
        </div>
    );
}
