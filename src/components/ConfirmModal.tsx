import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import Button from "./Button";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);
    const onDelete = useCallback(() => {
        setIsLoading(true);

        axios
            .delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose();
                router.push("/conversations");
                router.refresh();
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
    }, [conversationId, router, onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex gap-2">
                <div className="h-5 w-5 text-rose-500 font-bold ">
                    <FiAlertTriangle />
                </div>
                <div className="flex flex-col gap-1">
                    <Dialog.Title className="font-bold text-sm flex  justify-start ">
                        Delete Conversation
                    </Dialog.Title>
                    <div className="text-xs text-gray-600 text-start flex justify-start">
                        <p>
                            Are you sure you want to delete this conversation!
                            This cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            disabled={isLoading}
                            secondary={true}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            disabled={isLoading}
                            danger={true}
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
