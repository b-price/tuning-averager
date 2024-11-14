import React, { useState } from 'react';

interface ArrowSelectorProps {
    options: string[] | number[];
    initialValue: string | number;
    onChange: (value: string | number) => void;
}

const ArrowSelector: React.FC<ArrowSelectorProps> = (props:ArrowSelectorProps) => {
    const [selectedValue, setSelectedValue] = useState(props.initialValue);

    // Reverse the options array
    const reversedOptions = [...props.options].reverse();

    const incrementValue = () => {
        const currentIndex = reversedOptions.indexOf(selectedValue);
        //const nextIndex = (currentIndex + 1) % reversedOptions.length;
        const nextIndex = currentIndex === reversedOptions.length - 1 ? currentIndex : currentIndex + 1;
        const newValue = reversedOptions[nextIndex];
        setSelectedValue(newValue);
        props.onChange(newValue);
    };

    const decrementValue = () => {
        const currentIndex = reversedOptions.indexOf(selectedValue);
        //const prevIndex = (currentIndex - 1 + reversedOptions.length) % reversedOptions.length;
        const prevIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;
        const newValue = reversedOptions[prevIndex];
        setSelectedValue(newValue);
        props.onChange(newValue);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <button
                onClick={decrementValue}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-0.5 px-4 rounded-b-none w-full"
            >
                {'▲'}
            </button>
            <input
                type="text"
                value={selectedValue}
                readOnly
                className="bg-gray-700 text-white text-center font-semibold py-1.5 px-4 border-t-0 border-b-0 border-l-0 border border-gray-600 rounded-none w-full"
            />
            <button
                onClick={incrementValue}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-0.5 px-4 rounded-t-none w-full"
            >
                {'▼'}
            </button>
        </div>
    );
};

export default ArrowSelector;