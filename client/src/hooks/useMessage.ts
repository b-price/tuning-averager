import { useState } from "react";

export const useMessage = () => {
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [show, setShow] = useState<boolean>(false);

    const showMessage = (text: string, type: 'success' | 'error', time: number = 3000) => {
        setMessage(text);
        setMessageType(type);
        setShow(true);
        setTimeout(() => {
            setShow(false);
            setTimeout(() => {
                setMessage('');
                setMessageType('success');
            }, 300); // Delay to match the fade-out duration
        }, time);
    };

    return { message, messageType, show, showMessage };
};