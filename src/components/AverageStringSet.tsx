import {Instrument, StringSet} from "../types.ts";
import React, {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import {s} from "vite/dist/node/types.d-aGj9QkWt";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({stringSet, isOpen, onClose, onSubmit}) => {
    const [newGauges, setNewGauges] = useState<number[]>([]);
    const [woundStrings, setWoundStrings] = useState<boolean[]>([]);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (isOpen){
            setNewGauges(stringSet.gauges);
            setWoundStrings(stringSet.woundStrings);
        }
    }, [isOpen, stringSet])

    const handleStringSetChange = (index: number, value: number) => {
        setNewGauges((prevSet) => {
            const newSet = [...prevSet];
            newSet[index] = value;
            return newSet;
        })
    }

    const handleSubmit = () => {
        const newStringSet: StringSet = {
            name: name,
            gauges: newGauges,
            woundStrings: woundStrings,
        }
        onSubmit(newStringSet);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col p-8 mx-auto bg-gray-600 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Average String Set</h2>

                {/* String Set Name */}
                <div>
                    <label className="block text-sm font-medium">String Set Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* String Set Values */}
                <div>
                    <label className="block text-sm font-medium">String Gauges</label>
                    {newGauges.map((gauge, index) => (
                        <div key={index} className="flex items-center">
                            <label className="block text-sm font-medium mr-2">{index + 1}:</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={gauge}
                                onChange={(e) => handleStringSetChange(index, parseFloat(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </Modal>
    )
}

export default AverageStringSet;