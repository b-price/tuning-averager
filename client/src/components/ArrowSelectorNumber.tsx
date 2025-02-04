import React, {useEffect, useState} from "react";

interface ArrowSelectorProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
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
        const newValue = selectedValue + props.step;
        incOrDec(newValue);
    }

    const decrementValue = () => {
        const newValue = selectedValue - props.step;
        incOrDec(newValue);
    }

    const incOrDec = (newValue: number) => {
        if (newValue >= props.min && newValue <= props.max) {
            setSelectedValue(newValue);
            props.onChange(newValue);
        } else if (selectedValue < props.min) {
            setSelectedValue(props.min);
            props.onChange(props.min);
        } else if (selectedValue > props.max) {
            setSelectedValue(props.max);
            props.onChange(props.max);
        }
    }

    const changeValue = (value: string) => {
        if (Number.isFinite(+value)) {
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
