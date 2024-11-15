import {Instrument, StringSet} from "../../../types.ts";
import React, {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import {tension, uwFromGauge} from "../utils/calculate.ts";
import {stringTypeFactors} from "../defaults.ts";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
    averageTuning: number[];
    instrument: Instrument;
    unitWeights: number[];
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({stringSet, isOpen, onClose, onSubmit, averageTuning, instrument, unitWeights}) => {
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
                <h2 className="text-2xl font-bold mb-2">Average String Set</h2>
                <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3>

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
                                step={gauge < 13 ? 0.5 : 1}
                                value={gauge}
                                onChange={(e) => handleStringSetChange(index, parseFloat(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <p>
                                {tension(uwFromGauge(
                                    gauge,
                                    stringTypeFactors[instrument.type][woundStrings[index] ? 'wound' : 'plain'].coeff,
                                    stringTypeFactors[instrument.type][woundStrings[index] ? 'wound' : 'plain'].power
                                ), averageTuning[index], instrument.scale).toFixed(2)} lbs.
                            </p>
                        </div>
                    ))}
                </div>

                {/*Submit Button*/}
                <button
                    className="bg-indigo-600 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2"
                    onClick={handleSubmit}
                >
                    Add String Set to Instrument
                </button>

            </div>
        </Modal>
    )
}

export default AverageStringSet;