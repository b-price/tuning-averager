import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Tuning } from '../types';

interface TuningConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedTuningNames: string[], wound3rd: boolean) => void;
    tunings: Tuning[];
    defaultChecked: boolean[];
    instrument: string;
}

const TuningConfirm: React.FC<TuningConfirmProps> = ({ isOpen, onClose, onSubmit, tunings, defaultChecked, instrument }) => {
    const [selectedTunings, setSelectedTunings] = useState<string[]>([]);
    const [wound3rd, setWound3rd] = useState<boolean>(false);

    useEffect(() => {
        // Set the initial state based on the defaultChecked prop
        if (isOpen) {
            setSelectedTunings(tunings.filter((_, index) => defaultChecked[index]).map(tuning => tuning.name));
        }
    }, [isOpen, tunings, defaultChecked]);

    const handleSubmit = () => {
        onSubmit(selectedTunings, wound3rd);
        onClose();
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, tuningName: string) => {
        setSelectedTunings(prev =>
            event.target.checked
                ? [...prev, tuningName]
                : prev.filter(name => name !== tuningName)
        );
    };

    const handleLabelClick = (tuningName: string) => {
        setSelectedTunings(prev =>
            prev.includes(tuningName)
                ? prev.filter(name => name !== tuningName)
                : [...prev, tuningName]
        );
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-1">Select Tunings</h2>
            <h3 className="text-md font-semibold mb-2">for {instrument}</h3>
            <ul>
                {tunings.map(tuning => (
                    <li key={tuning.name}>
                        <input
                            type="checkbox"
                            checked={selectedTunings.includes(tuning.name)}
                            onChange={(e) => handleCheckboxChange(e, tuning.name)}
                            className="mr-2"
                        />
                        <label
                            className="cursor-pointer"
                            onClick={() => handleLabelClick(tuning.name)}
                        >
                            {tuning.name}
                        </label>
                    </li>
                ))}
            </ul>

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
            <button onClick={handleSubmit} className="m-6 bg-blue-500 text-white px-4 py-2 rounded">
                Get Average String Set
            </button>
        </Modal>
    );
};

export default TuningConfirm;