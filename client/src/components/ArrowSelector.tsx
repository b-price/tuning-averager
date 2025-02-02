import React, { useState } from "react";

interface ArrowSelectorProps {
    options: string[] | number[];
    initialValue: string | number;
    onChange: (value: string | number) => void;
    disabled?: boolean;
}

const ArrowSelector: React.FC<ArrowSelectorProps> = (
    props: ArrowSelectorProps,
) => {
    const [selectedValue, setSelectedValue] = useState(props.initialValue);

    const reversedOptions = [...props.options].reverse();

    const incrementValue = () => {
        if (props.disabled) {
            console.log("Disabled!");
        } else {
            const currentIndex = reversedOptions.indexOf(selectedValue);
            const nextIndex =
                currentIndex === reversedOptions.length - 1
                    ? currentIndex
                    : currentIndex + 1;
            const newValue = reversedOptions[nextIndex];
            setSelectedValue(newValue);
            props.onChange(newValue);
        }
    };

    const decrementValue = () => {
        if (props.disabled) {
            console.log("Disabled!");
        } else {
            const currentIndex = reversedOptions.indexOf(selectedValue);
            const prevIndex =
                currentIndex === 0 ? currentIndex : currentIndex - 1;
            const newValue = reversedOptions[prevIndex];
            setSelectedValue(newValue);
            props.onChange(newValue);
        }
    };

    return (
        <div className="">
            {props.disabled ? (
                <div className="flex flex-col items-center w-full">
                    <button
                        className="dark:bg-gray-800 dark:text-gray-400 bg-gray-300 text-gray-500 font-bold py-0.5 px-4 rounded-b-none w-full"
                        disabled
                    >
                        {"▲"}
                    </button>
                    <input
                        type="text"
                        value={selectedValue}
                        readOnly
                        disabled
                        className="dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-gray-500 text-center font-semibold py-1.5 px-4 border-0 border-gray-600 rounded-none w-full"
                    />
                    <button
                        className="dark:bg-gray-800 dark:text-gray-400 text-gray-500 bg-gray-300 font-bold py-0.5 px-4 rounded-t-none w-full "
                        disabled
                    >
                        {"▼"}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <button
                        onClick={decrementValue}
                        className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-0.5 px-4 rounded-b-none w-full"
                    >
                        {"▲"}
                    </button>
                    <input
                        type="text"
                        value={selectedValue}
                        readOnly
                        className="dark:bg-gray-700 bg-gray-200 text-center font-semibold py-1.5 px-4 border-0 border-gray-600 rounded-none w-full"
                    />
                    <button
                        onClick={incrementValue}
                        className="dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-0.5 px-4 rounded-t-none w-full"
                    >
                        {"▼"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArrowSelector;
