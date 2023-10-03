"use client";

import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    return (
        <Transition.Root
            show={isOpen}
            appear
            as={Fragment}
        >
            <Dialog
                as="div"
                className="z-50 relative"
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
                    {/* here inset is used top left right bottom offsets */}
                    <div className="fixed inset-1 bg-black bg-opacity-25 transition-opacity " />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto z-10">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="sm:max-w-lg py-4 px-4 rounded-md sm:my-8 relative overflow-hidden transform  w-full bg-white">
                                <div className="absolute right-2 top-2 hidden sm:block z-20">
                                    <button
                                        className="rounded-full bg-white text-gray-400 hover:text-gray-500
                                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 "
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <IoClose
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                .
            </Dialog>
        </Transition.Root>
    );
};

export default Modal;
