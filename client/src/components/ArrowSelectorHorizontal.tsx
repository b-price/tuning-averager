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

const ArrowSelectorHorizontal: React.FC<ArrowSelectorProps> = (
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
        // setSelectedValue(parseFloat(value));
        // props.onChange(parseFloat(value));
    }

    return (
        <div className="">
            {props.disabled ? (
                <div className="flex w-full">
                    <button
                        className="dark:bg-gray-800 dark:text-gray-400 bg-gray-300 text-gray-500 font-bold py-1.5 px-2 rounded-e-none"
                        disabled
                    >
                        {"◀"}
                    </button>
                    <input
                        type="text"
                        value={selectedValue}
                        readOnly
                        disabled
                        className="dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-gray-500 text-center font-semibold py-1.5 px-0 border-0 rounded-none w-14"
                    />
                    <button
                        className="dark:bg-gray-800 dark:text-gray-400 text-gray-500 bg-gray-300 font-bold py-1.5 px-2 rounded-s-none"
                        disabled
                    >
                        {"▶"}
                    </button>
                </div>
            ) : (
                <div className="flex w-full">
                    <button
                        onClick={decrementValue}
                        className={`dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-1.5 px-2 rounded-e-none ${props.errorState && "border-r-0 border-red-500"}`}
                    >
                        {"◀"}
                    </button>
                    <input
                        type="text"
                        value={selectedValue}
                        readOnly={!props.input}
                        onChange={(e) => changeValue(e.target.value)}
                        className={`dark:bg-gray-700 bg-gray-200 text-center font-semibold py-1.5 px-0 rounded-none w-14 ${props.errorState ? "border-x-0 border-red-500" : "border-0"}`}
                    />
                    <button
                        onClick={incrementValue}
                        className={
                            `dark:bg-gray-800 bg-gray-400 dark:hover:bg-gray-700 hover:bg-gray-300 font-bold py-1.5 px-2 rounded-s-none ${props.errorState && "border-l-0 border-red-500"}`
                        }
                    >
                        {"▶"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArrowSelectorHorizontal;
