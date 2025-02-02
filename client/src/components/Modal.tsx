import React, { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const handleOverlayClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center overflow-y-auto z-10"
            onClick={handleOverlayClick}
        >
            <div className="modal rounded-lg shadow-lg p-1 max-h-screen overflow-y-auto">
                <span className="grid justify-items-end items-start">
                    <button
                        onClick={onClose}
                        className="x-button text-3xl py-1 px-3"
                    >
                        ✕
                    </button>
                </span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
