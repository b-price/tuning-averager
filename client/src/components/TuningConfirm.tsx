import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Tuning } from '../../../types.ts';

interface TuningConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedTunings: Tuning[], wound3rd: boolean) => void;
    tunings?: Tuning[];
    defaultChecked?: boolean[];
    instrument?: string;
}

const TuningConfirm: React.FC<TuningConfirmProps> = ({ isOpen, onClose, onSubmit, tunings, defaultChecked, instrument }) => {
    const [selected, setSelected] = useState<boolean[]>(Array(tunings ? tunings.length : 1).fill(true));
    const [wound3rd, setWound3rd] = useState<boolean>(false);

    useEffect(() => {
        // Set the initial state based on the defaultChecked prop
        if (isOpen && tunings && tunings.length && defaultChecked && defaultChecked.length) {
            setSelected(defaultChecked);
        }
    }, [isOpen, tunings, defaultChecked]);

    if (!isOpen || !tunings || !tunings.length || !defaultChecked || !defaultChecked.length || !instrument) {
        return null;
    }

    const handleSubmit = () => {
        const selectedTunings = tunings.filter((_, index) => selected[index]);
        onSubmit(selectedTunings, wound3rd);
        setWound3rd(false);
        onClose();
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>,index: number) => {
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
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-1 mt-0">Select Tunings</h2>
            <h3 className="text-md font-semibold mb-2">for {instrument}</h3>
            <div className="grid justify-items-center">

                {/*Tunings*/}
                <ul className="grid justify-items-start">
                    <li className="mb-3">
                        <input
                            type="checkbox"
                            checked={selected.every((_, index) => selected[index])}
                            onChange={(e) => handleSelectAll(e)}
                            className="mr-2"
                        />
                        <label className="font-semibold">
                            All/None
                        </label>
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

                {/*Wound 3rd Switch*/}
                {tunings[0].type === 'guitar' ? (
                    <div className="flex items-center mt-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={wound3rd}
                                onChange={(e) => setWound3rd(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium">Wound 3rd</span>
                        </label>
                    </div>
                ) : (<div></div>)}
            </div>

            <button onClick={handleSubmit} className="m-6 bg-blue-500 text-white px-4 py-2 rounded">
                Get Average String Set
            </button>
        </Modal>
    );
};

export default TuningConfirm;