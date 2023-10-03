import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import React, { useMemo, Fragment, useState } from "react";
import format from "date-fns/format";
import { Transition, Dialog } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import Avatar from "./Avatar";
import { MdDelete } from "react-icons/md";
import ConfirmModal from "./ConfirmModal";
import { useRouter } from "next/navigation";
import AvatarGroup from "./AvatarGroup";
import useActiveChannel from "@/hooks/useActiveChannel";
import useActiveList from "@/hooks/useActiveList";

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
        users: User[];
    };
}

const ProfileDrawer = ({ onClose, isOpen, data }: ProfileDrawerProps) => {
    const router = useRouter();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const otherUser = useOtherUser(data);

    const joinedDate = useMemo(() => {
        if (!otherUser) {
            return router.push("/conversations");
        }
        return format(new Date(otherUser.createdAt), "PP");
    }, [otherUser?.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name]);

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser.email!) !== -1;

    const statusText = useMemo(() => {
        if (data?.isGroup) {
            return `${data.users.length} members`;
        }

        return isActive ? "Active" : "Offline";
    }, [data, isActive]);
    return (
        <>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
            />
            <Transition
                appear
                show={isOpen}
                as={Fragment}
            >
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={onClose}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className=" min-h-full flex justify-end ">
                            {/* Here we have used the fixed to smooth out our transition */}
                            <div className="block fixed right-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition transform duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition transform duration-500"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="w-full overflow-y-scroll max-w-md transform overflow-hidden rounded-2xl h-screen min-w-[300px]  bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-end">
                                                <button
                                                    className=" hover:ring-1 text-2xl focus:ring-sky-500 rounded-full cursor-pointer p-1"
                                                    onClick={onClose}
                                                >
                                                    <IoCloseCircle />
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="flex flex-col items-center">
                                                    {data.isGroup ? (
                                                        <AvatarGroup
                                                            users={data.users}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            user={otherUser}
                                                        />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">
                                                            {data.name}
                                                        </span>
                                                        <span>
                                                            {statusText}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span
                                                    className="text-2xl cursor-pointer"
                                                    onClick={() =>
                                                        setIsConfirmOpen(true)
                                                    }
                                                >
                                                    <MdDelete />
                                                </span>
                                                <span className="font-bold text-xs">
                                                    Delete
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-sm items-start">
                                                {data.isGroup ? (
                                                    <div>
                                                        <dt className="text-sm font-bold ">
                                                            Emails
                                                        </dt>
                                                        <dd className="">
                                                            {data.users
                                                                .map(
                                                                    (user) =>
                                                                        user.email
                                                                )
                                                                .join(", ")}
                                                        </dd>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold">
                                                                Email
                                                            </span>
                                                            <span>
                                                                {
                                                                    otherUser.email
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="h-0.5 my-2 bg-gray-600 w-full opacity-75" />

                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold">
                                                                Joined
                                                            </span>
                                                            <span>
                                                                {
                                                                    joinedDate as string
                                                                }
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default ProfileDrawer;
