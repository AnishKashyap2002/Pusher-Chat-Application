import React from "react";
import Modal from "./Modal";
import Image from "next/image";

interface ImageModalProps {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

const ImageModal = ({ src, isOpen, onClose }: ImageModalProps) => {
    if (!src) {
        return null;
    }
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
        >
            <div className="w-80 h-80">
                <Image
                    alt="image"
                    src={src}
                    fill
                    className="z-10"
                />
            </div>
        </Modal>
    );
};

export default ImageModal;
