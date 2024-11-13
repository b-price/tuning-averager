import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Tuning } from '../types';

interface TuningConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedTuningNames: string[]) => void;
    tunings: Tuning[];
    defaultChecked: boolean[]; // New prop for default checked state
}

const TuningConfirm: React.FC<TuningConfirmProps> = ({ isOpen, onClose, onSubmit, tunings, defaultChecked }) => {
    const [selectedTunings, setSelectedTunings] = useState<string[]>([]);

    useEffect(() => {
        // Set the initial state based on the defaultChecked prop
        if (isOpen) {
            setSelectedTunings(tunings.filter((_, index) => defaultChecked[index]).map(tuning => tuning.name));
        }
    }, [isOpen, tunings, defaultChecked]);

    const handleSubmit = () => {
        onSubmit(selectedTunings);
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
            <h2 className="text-xl font-semibold mb-4">Select Tunings</h2>
            <ul>
                {tunings.map(tuning => (
                    <li key={tuning.name} >
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
            <button onClick={handleSubmit} className="m-6 bg-blue-500 text-white px-4 py-2 rounded">
                Get Average String Set
            </button>
        </Modal>
    );
};

export default TuningConfirm;