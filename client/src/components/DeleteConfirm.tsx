import React from "react";
import Modal from "./Modal.tsx";

interface DeleteConfirmProps {
    onClose: () => void;
    isOpen: boolean;
    deleteFunction: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({onClose, isOpen, deleteFunction}) => {

    const handleDelete = () => {
        deleteFunction();
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <div>
                <h2>Are you sure?</h2>
                <button
                    className="bg-gray-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    className="bg-red-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}

export default DeleteConfirm;