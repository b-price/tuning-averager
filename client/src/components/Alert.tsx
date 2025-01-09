import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error';
    show: boolean;
    style?: string;
}

const Alert: React.FC<AlertProps> = ({ message, type, show, style }) => {
    const baseStyles = 'px-4 py-3 rounded relative';
    const successStyles = 'bg-green-100 border-green-400 text-green-700 border-l-4';
    const errorStyles = 'bg-red-100 border-red-400 text-red-700 border-l-4';

    return (
        <div className={`sm:relative fixed mx-auto inset-0 transition-all ease-in-out duration-300 ${show ? "opacity-100" : "opacity-0 invisible h-0"}`}>
            {!!message &&
                <div className={`${baseStyles} ${style} ${type === 'success' ? successStyles : errorStyles}`}>
                    <strong className="font-bold">
                        {type === 'success' ? 'Success!' : 'Error!'}
                    </strong>
                    <span className="block sm:inline"> {message}</span>
                </div>
            }
        </div>
    );
};

export default Alert;