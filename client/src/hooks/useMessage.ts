import { useState } from "react";
import { MessageType } from "../../types.ts";

export const useMessage = () => {
    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<MessageType>("success");
    const [show, setShow] = useState<boolean>(false);

    const showMessage = (
        text: string,
        type: MessageType,
        time: number = 3000,
    ) => {
        setMessage(text);
        setMessageType(type);
        setShow(true);
        if (time !== 0 && time !== Infinity) {
            setTimeout(() => {
                setShow(false);
                setTimeout(() => {
                    setMessage("");
                    setMessageType("success");
                }, 300); // Delay to match the fade-out duration
            }, time);
        }
    };

    const closeMessage = () => {
        setShow(false);
        setTimeout(() => {
            setMessage("");
            setMessageType("success");
        }, 300); // Delay to match the fade-out duration
    };

    return { message, messageType, show, showMessage, closeMessage };
};
