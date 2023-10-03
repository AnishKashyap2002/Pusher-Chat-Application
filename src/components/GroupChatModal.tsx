"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import {
    FieldValue,
    FieldValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

interface GroupChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModal = ({ isOpen, onClose, users }: GroupChatModalProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            members: [],
        },
    });

    const members = watch("members");

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                ...data,
                isGroup: true,
            })
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
    };
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12 text-start">
                    <div className="border-b border-b-gray-700/10 pb-10">
                        <h2 className="font-bold">Create a Group Chat</h2>
                        <p className="text-sm font-light">
                            Create a chat with mroe than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                register={register}
                                errors={errors}
                                id="name"
                                label="Name"
                                disabled={isLoading}
                                required
                            />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name,
                                }))}
                                // you can check it out man...
                                onChange={(value) =>
                                    setValue("members", value, {
                                        shouldValidate: true,
                                    })
                                }
                                value={members}
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            secondary
                        >
                            cancel
                        </Button>

                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default GroupChatModal;
