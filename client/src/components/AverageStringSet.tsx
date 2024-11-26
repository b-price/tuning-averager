import {Instrument, StringSet} from "../../../types.ts";
import React, {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import {convertToNote, tension, uwFromGauge} from "../utils/calculate.ts";
import {stringTypeFactors} from "../defaults.ts";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
    averageTuning: number[];
    instrument?: Instrument;
}

interface Note {
    note: string;
    cents: string;
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({stringSet, isOpen, onClose, onSubmit, averageTuning, instrument}) => {
    const [newGauges, setNewGauges] = useState<number[]>([]);
    const [woundStrings, setWoundStrings] = useState<boolean[]>([]);
    const [name, setName] = useState<string>('');
    const [tensions, setTensions] = useState<number[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        if (isOpen){
            setNewGauges(stringSet.gauges);
            setWoundStrings(stringSet.woundStrings);
            setTensions(stringSet.tensions);
            setNotes(stringSet.noteValues.map((noteValue) => convertToNote(noteValue)));
        }
    }, [isOpen, stringSet])

    const handleStringSetChange = (stringIndex: number, gauge: number) => {

        setNewGauges((prevSet) => {
            const newSet = [...prevSet];
            newSet[stringIndex] = gauge;
            return newSet;
        })
        setTensions((prevTensions) => {
            const newTensions = [...prevTensions]
            if (instrument) {
                newTensions[stringIndex] = tension(uwFromGauge(
                    gauge,
                    stringTypeFactors[instrument.type][woundStrings[stringIndex] ? 'wound' : 'plain'].coeff,
                    stringTypeFactors[instrument.type][woundStrings[stringIndex] ? 'wound' : 'plain'].power
                ), averageTuning[stringIndex], instrument.scale);
            }
            return newTensions;
        })
    }

    const handleSubmit = () => {
        const newStringSet: StringSet = {
            name: name,
            gauges: newGauges,
            woundStrings: woundStrings,
            tensions: tensions,
            noteValues: stringSet.noteValues
        }
        onSubmit(newStringSet);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col p-8 mx-auto bg-gray-600 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-2">Average String Set</h2>
                {instrument ? <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3> : <></>}

                {/* String Set Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">String Set Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* String Set Values */}
                <div className="grid grid-cols-7 gap-2 mb-4">

                    <label className="block text-sm font-medium">String</label>
                    <label className="block text-sm font-medium">Note</label>
                    <label className="block text-sm font-medium">Cents</label>
                    <label className="col-span-2 block text-sm font-medium">Gauge</label>
                    <label className="col-span-2 block text-sm font-medium">Tension</label>


                    {newGauges.map((gauge, index) => (
                        <div key={index} className="grid grid-cols-subgrid col-span-7 items-center gap-x-0">
                            <label className="block text-sm font-medium mr-2">{index + 1}:</label>
                            <p>{notes[index].note}</p>
                            <p>{notes[index].cents}</p>
                            <div className="flex col-span-2 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    step={gauge < 13 ? 0.5 : 1}
                                    value={gauge}
                                    onChange={(e) => handleStringSetChange(index, parseFloat(e.target.value))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="font-semibold ml-1">{woundStrings[index] ? "w" : "p"}</p>
                            </div>

                            <p className="col-span-2">
                                {tensions[index].toFixed(2)} lbs.
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