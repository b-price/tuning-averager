import React, {useEffect, useState} from "react";

interface ArrowSelectorProps {
    options: string[] | number[];
    value: string | number;
    onChange: (value: string | number) => void;
    input?: boolean;
    disabled?: boolean;
    errorState: boolean;
}

const ArrowSelector: React.FC<ArrowSelectorProps> = (
    props: ArrowSelectorProps,
) => {
    const [selectedValue, setSelectedValue] = useState(props.value);

    useEffect(() => {
        setSelectedValue(props.value);
    }, [props.value]);

    const incrementValue = () => {
        const currentIndex = [...props.options].indexOf(selectedValue);
        if (currentIndex >= 0) {
            const nextIndex = currentIndex === props.options.length - 1 ? currentIndex : currentIndex + 1;
            const newValue = props.options[nextIndex];
            setSelectedValue(newValue);
            props.onChange(newValue);
        } else {
            const newValue = props.options[props.options.length -1];
            setSelectedValue(newValue);
            props.onChange(newValue)
        }
    }

    const decrementValue = () => {
        const currentIndex = [...props.options].indexOf(selectedValue);
        if (currentIndex >= 0) {
            const nextIndex = currentIndex === 0 ? currentIndex : currentIndex -1;
            const newValue = props.options[nextIndex];
            setSelectedValue(newValue);
            props.onChange(newValue);
        } else {
            const newValue = props.options[0];
            setSelectedValue(newValue);
            props.onChange(newValue)
        }
    }

    const changeValue = (value: string) => {
        if (typeof props.value !== "number") {
            setSelectedValue(value);
            props.onChange(value);
        } else if (Number.isFinite(+value)) {
            setSelectedValue(+value);
            props.onChange(+value);
        }
    }

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
                        className="dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-gray-500 text-center font-semibold py-1.5 px-0 border-0 border-gray-600 rounded-none w-full"
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
                        onClick={incrementValue}
                        className={`dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-0.5 px-4 rounded-b-none w-full ${props.errorState && "border-b-0 border-red-500"}`}
                    >
                        {"▲"}
                    </button>
                    <input
                        type="text"
                        value={selectedValue}
                        readOnly={!props.input}
                        onChange={(e) => changeValue(e.target.value)}
                        className={
                            `dark:bg-gray-700 bg-gray-200 text-center font-semibold py-1.5 px-0 rounded-none w-full ${props.errorState ? "border-y-0 border-red-500" : "border-0"}`
                        }
                    />
                    <button
                        onClick={decrementValue}
                        className={`dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-0.5 px-4 rounded-t-none w-full ${props.errorState && "border-t-0 border-red-500"}`}
                    >
                        {"▼"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArrowSelector;
