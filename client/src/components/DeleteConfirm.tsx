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
                <h2 className="text-lg font-semibold mx-6 mb-2">Are you sure? <br/>Action cannot be undone.</h2>
                <div className="mb-3">
                    <button
                        className="bg-gray-500 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white m-2 px-4 py-2 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteConfirm;