"use client";
import useRoutes from "@/hooks/useRoutes";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Image from "next/image";
import Input from "./Input";
import user from "../../public/user.jpeg";
import { BsCloudUpload } from "react-icons/bs";
import { CldUploadButton } from "next-cloudinary";
import Button from "./Button";

interface SettingsModalProps {
    isOpen?: boolean;
    onClose: () => void;
    currentUser: User;
}

const SettingsModal = ({
    isOpen,
    onClose,
    currentUser,
}: SettingsModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        },
    });

    // here it is used so that when we change image it can be shown
    const image = watch("image");

    const handleUpload = (result: any) => {
        setValue("image", result?.info?.secure_url, {
            shouldValidate: true,
        });
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post("/api/settings", data)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error("Something Went Wrong"))
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <div className="text-start h-full   border-b-4 border-gray-900/10 pb-12">
                        <h2 className="font-semibold text-md leading-4">
                            Profile
                        </h2>
                        <p className="text-gray-800 text-sm leading-6">
                            Edit your public information.
                        </p>
                        <div className="flex flex-col gap-y-2">
                            <Input
                                register={register}
                                id="name"
                                label="Name"
                                errors={errors}
                                required
                                disabled={isLoading}
                            />
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-sm">
                                    Photo
                                </label>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={image || user}
                                        width="50"
                                        height="50"
                                        alt="User image"
                                        className="rounded-full object-contain"
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onUpload={handleUpload}
                                        uploadPreset="s0suaub8"
                                    >
                                        <Button
                                            disabled={isLoading}
                                            secondary
                                        >
                                            Change
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex py-2 items-center justify-between self-end">
                        <Button secondary>Cancel</Button>
                        <Button>Submit</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;
