import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Instrument, Tuning } from "../../types.ts";
import ToggleSwitch from "./ToggleSwitch.tsx";
import { useMessage } from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";
import {
    DEFAULT_INST,
    DEFAULT_STRING_MATERIAL,
    STRING_MATERIAL_FACTORS,
} from "../defaults.ts";
import { formatMaterial } from "../utils/calculate.ts";

interface TuningConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        selectedTunings: Tuning[],
        wound3rd: boolean,
        stringMaterial: string,
    ) => void;
    tunings?: Tuning[];
    defaultChecked?: boolean[];
    instrument: Instrument;
}

const TuningConfirm: React.FC<TuningConfirmProps> = ({
    isOpen,
    onClose,
    onSubmit,
    tunings,
    defaultChecked,
    instrument = DEFAULT_INST,
}) => {
    const [selected, setSelected] = useState<boolean[]>(
        Array(tunings ? tunings.length : 1).fill(true),
    );
    const [wound3rd, setWound3rd] = useState<boolean>(false);
    const [stringMaterial, setStringMaterial] = useState<string>(
        DEFAULT_STRING_MATERIAL[instrument.type],
    );
    const { message, messageType, showMessage, show, closeMessage } =
        useMessage();

    useEffect(() => {
        // Set the initial state based on the defaultChecked prop
        if (
            isOpen &&
            tunings &&
            tunings.length &&
            defaultChecked &&
            defaultChecked.length
        ) {
            setSelected(defaultChecked);
        }
        setStringMaterial(DEFAULT_STRING_MATERIAL[instrument.type]);
    }, [isOpen, tunings, defaultChecked]);

    if (
        !isOpen ||
        !tunings ||
        !tunings.length ||
        !defaultChecked ||
        !defaultChecked.length
    ) {
        return null;
    }

    const handleSubmit = () => {
        if (selected.length > 0 && selected.includes(true)) {
            const selectedTunings = tunings.filter(
                (_, index) => selected[index],
            );
            onSubmit(selectedTunings, wound3rd, stringMaterial);
            setWound3rd(false);
            onClose();
        } else {
            showMessage("Please select at least one tuning.", "error");
        }
    };

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const newSelected = [...selected];
        newSelected[index] = event.target.checked;
        setSelected(newSelected);
    };

    const handleLabelClick = (index: number) => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = Array(selected.length).fill(event.target.checked);
        setSelected(newSelected);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-1 mt-0">Select Tunings</h2>
            <h3 className="text-md font-semibold mb-2">
                for {instrument.name}
            </h3>
            <div className="grid justify-items-center">
                {/*Tunings*/}
                <ul className="grid justify-items-start">
                    <li className="mb-3">
                        <input
                            type="checkbox"
                            checked={selected.every(
                                (_, index) => selected[index],
                            )}
                            onChange={(e) => handleSelectAll(e)}
                            className="mr-2"
                        />
                        <label className="font-semibold">All/None</label>
                    </li>
                    {tunings.map((tuning, index) => (
                        <li key={index}>
                            <input
                                type="checkbox"
                                checked={selected[index]}
                                onChange={(e) => handleCheckboxChange(e, index)}
                                className="mr-2"
                            />
                            <label
                                className="cursor-pointer"
                                onClick={() => handleLabelClick(index)}
                            >
                                {tuning.name}
                            </label>
                        </li>
                    ))}
                </ul>

                {/*Select String Type*/}
                <div className="m-4">
                    <label className="block text-sm font-medium">
                        String Material
                    </label>
                    <select
                        onChange={(e) => setStringMaterial(e.target.value)}
                        className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                        value={stringMaterial}
                    >
                        {Object.keys(STRING_MATERIAL_FACTORS)
                            .filter(
                                (sm) =>
                                    sm.includes(instrument.type) ||
                                    sm === "Kalium",
                            )
                            .map((str, index) => (
                                <option key={index} value={str}>
                                    {formatMaterial(str)}
                                </option>
                            ))}
                    </select>
                </div>

                {/*Wound 3rd Switch*/}
                {tunings[0].type === "guitar" ? (
                    <ToggleSwitch
                        checked={wound3rd}
                        onChange={(e) => setWound3rd(e.target.checked)}
                    >
                        <span className="ml-3 text-sm font-medium">
                            Wound 3rd
                        </span>
                    </ToggleSwitch>
                ) : (
                    <div></div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className="bg-indigo-500 text-white m-6 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
            >
                Get Average String Set
            </button>
            <Alert
                show={show}
                message={message}
                type={messageType}
                onClose={closeMessage}
                style="m-3"
            />
        </Modal>
    );
};

export default TuningConfirm;
