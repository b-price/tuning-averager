import React from "react";
import { MessageType } from "../../types.ts";

interface AlertProps {
    message: string;
    type: MessageType;
    show: boolean;
    style?: string;
    onClose: () => void;
    fixed?: boolean;
}

const Alert: React.FC<AlertProps> = ({
    message,
    type,
    show,
    style,
    onClose,
    fixed = true,
}) => {
    const baseStyles = "px-4 py-3 rounded relative flex items-center";
    const successStyles =
        "bg-green-100 border-green-400 text-green-700 border-l-4";
    const errorStyles = "bg-red-100 border-red-400 text-red-700 border-l-4";
    const warningStyles =
        "bg-orange-100 border-orange-400 text-orange-700 border-l-4";

    return (
        <div
            className={`sm:relative ${fixed ? "fixed" : "relative"} mx-auto inset-0 transition-all ease-in-out duration-300 ${show ? "opacity-100" : "opacity-0 invisible h-0"}`}
        >
            {!!message && (
                <div
                    className={`${baseStyles} ${style} ${
                        type === "success"
                            ? successStyles
                            : type === "error"
                              ? errorStyles
                              : warningStyles
                    }`}
                >
                    <strong className="font-bold mr-2">
                        {type === "success"
                            ? "Success!"
                            : type === "error"
                              ? "Error!"
                              : "Warning!"}
                    </strong>
                    <span className="block sm:inline"> {message}</span>
                    <button
                        onClick={onClose}
                        className="bg-transparent text-xl py-1 px-3"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default Alert;
