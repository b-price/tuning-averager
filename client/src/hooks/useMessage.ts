// Utility function for setting messages
import {useState} from "react";

export const useMessage = () => {
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const showMessage = (text: string, type: 'success' | 'error', time: number = 3000) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), time);
    };

    return { message, messageType, showMessage };
};