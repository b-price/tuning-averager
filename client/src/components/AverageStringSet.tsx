import { Instrument, StringSet } from "../../../types.ts";
import React, { useEffect, useState } from "react";
import Modal from "./Modal.tsx";
import { convertToNote, tension, uwFromGauge } from "../utils/calculate.ts";
import {notes, stringTypeFactors, STRING_GAUGES, WOUND_CHAR, PLAIN_CHAR, REFERENCE_PITCH} from "../defaults.ts";
import ArrowSelector from "./ArrowSelector.tsx";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
    instrument?: Instrument;
    isEdit: boolean;
    editStringSet: (stringSet: StringSet) => void;
    referencePitch: number;
}

interface Note {
    note: string;
    cents: number;
    noteValue: number;
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({ stringSet, isOpen, onClose, onSubmit, instrument, isEdit, editStringSet, referencePitch = REFERENCE_PITCH }) => {
    const [newGauges, setNewGauges] = useState<number[]>([]);
    const [woundStrings, setWoundStrings] = useState<boolean[]>([]);
    const [name, setName] = useState<string>('');
    const [tensions, setTensions] = useState<number[]>([]);
    const [noteObjects, setNoteObjects] = useState<Note[]>([]);
    const [favorite, setFavorite] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            resetToAverageTuning();
        }
    }, [isOpen, stringSet]);

    const resetToAverageTuning = () => {
        setNewGauges(stringSet.gauges);
        setWoundStrings(stringSet.woundStrings);
        setTensions(stringSet.tensions);
        setNoteObjects(stringSet.noteValues.map((noteValue) => convertToNote(noteValue)));
        setName(stringSet.name);
        setFavorite(stringSet.favorite || false);
    };

    const handleStringGaugeChange = (stringIndex: number, gauge: number) => {
        setNewGauges((prevSet) => {
            const newSet = [...prevSet];
            newSet[stringIndex] = gauge;
            return newSet;
        });
        adjustTension(stringIndex, gauge, noteObjects[stringIndex].noteValue);
    };

    const handleCentsChange = (stringIndex: number, cents: number) => {
        if (!isNaN(cents) && cents >= 0 && cents < 100) {
            const noteValue = Math.floor(noteObjects[stringIndex].noteValue) + cents / 100;
            const note = {
                note: noteObjects[stringIndex].note,
                cents: cents,
                noteValue: noteValue,
            };
            setNoteObjects((prevNotes) => {
                const newNotes = [...prevNotes];
                newNotes[stringIndex] = note;
                return newNotes;
            });
            adjustTension(stringIndex, newGauges[stringIndex], noteValue);
        }
    };

    const adjustTension = (stringIndex: number, gauge: number, noteValue: number, wound?: boolean) => {
        if (instrument) {
            const woundState = typeof wound === 'boolean' ? wound : woundStrings[stringIndex];
            const woundString = woundState ? 'wound' : 'plain';
            setTensions((prevTensions) => {
                const newTensions = [...prevTensions];
                newTensions[stringIndex] = tension(
                    uwFromGauge(
                        gauge,
                        stringTypeFactors[instrument.type][woundString].coeff,
                        stringTypeFactors[instrument.type][woundString].power
                    ),
                    noteValue,
                    instrument.scale,
                    referencePitch
                );
                return newTensions;
            });
        }
    };

    const handleNotesChange = (stringIndex: number, note: string | number) => {
        note = typeof note === 'number' ? note.toString() : note;
        const newNote = { note: note, cents: 0, noteValue: notes.indexOf(note) };
        setNoteObjects((prevNotes) => {
            const newNotes = [...prevNotes];
            newNotes[stringIndex] = newNote;
            return newNotes;
        });
        adjustTension(stringIndex, newGauges[stringIndex], newNote.noteValue);
    };

    const toggleWoundString = (stringIndex: number) => {
        const wound = !woundStrings[stringIndex];
        setWoundStrings((prevWoundStrings) => {
            const newWoundStrings = [...prevWoundStrings];
            newWoundStrings[stringIndex] = wound;
            return newWoundStrings;
        });
        adjustTension(stringIndex, newGauges[stringIndex], noteObjects[stringIndex].noteValue, wound);
    };

    const handleSubmit = () => {
        const newStringSet: StringSet = {
            id: isEdit ? stringSet.id : Math.random().toString(36),
            name: name,
            gauges: newGauges,
            woundStrings: woundStrings,
            tensions: tensions,
            noteValues: stringSet.noteValues,
            favorite: favorite,
        };
        if (isEdit) {
            editStringSet(newStringSet);
        } else {
            onSubmit(newStringSet);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col mx-auto sm:px-8 px-4 pb-6 rounded-xl md:max-w-xl">
                <h2 className="text-2xl font-bold mb-2 mt-0">{isEdit ? "Editing " : "Average "}String Set</h2>
                {instrument ? <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3> : <></>}

                {/* String Set Name / Favorite */}
                <div className="flex items-center justify-evenly mb-4">
                    <div className="justify-items-center">
                        <label className="block text-sm font-medium">String Set Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="justify-items-center">
                        <label className="block text-sm font-medium">Favorite</label>
                        <button onClick={() => setFavorite(!favorite)} className="text-2xl font-bold x-button py-1 px-3 focus:outline-none">{favorite ? "★" : "☆"}</button>
                    </div>
                </div>


                {/* String Set Values */}
                <div className="grid grid-cols-4 gap-y-0 gap-x-4 mb-4">
                    <div className="col-span-2 flex justify-center">
                        {/*<label className="block text-sm font-medium col-span-2">String</label>*/}
                        {/*<label className="block text-sm font-medium text-center">Note</label>*/}
                        {/*<label className="block text-sm font-medium">Cents</label>*/}
                        <label className="block text-sm font-medium">Average Note</label>
                    </div>

                    <label className="block text-sm font-medium">Gauge</label>
                    <label className="block text-sm font-medium">Tension</label>

                    {newGauges.map((gauge, index) => (
                        <div key={index} className="grid grid-cols-subgrid col-span-4 items-center">
                            <div className="flex items-center col-span-2">
                                <label className="block text-sm font-semibold mr-2">{index + 1}:</label>
                                <div className="w-3/4 scale-90">
                                    <ArrowSelector
                                        key={index + noteObjects[index].note}
                                        options={notes}
                                        initialValue={noteObjects[index].note}
                                        onChange={(note) => handleNotesChange(index, note)}
                                    />
                                </div>
                                <p>+</p>
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    step="10"
                                    value={noteObjects[index].cents}
                                    onChange={(e) => handleCentsChange(index, parseFloat(e.target.value))}
                                    className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p>¢</p>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="sm:w-3/4 scale-90">
                                    <ArrowSelector
                                        key={index + gauge}
                                        options={STRING_GAUGES}
                                        initialValue={gauge}
                                        onChange={(newGauge) => handleStringGaugeChange(index, newGauge as number)}
                                    />
                                </div>

                                {/* Toggle wound/plain */}
                                <p
                                    className="font-semibold ml-2 cursor-pointer hover:text-indigo-400"
                                    onClick={() => toggleWoundString(index)}
                                >
                                    {woundStrings[index] ? WOUND_CHAR : PLAIN_CHAR}
                                </p>
                            </div>

                            <p className="">
                                <strong>{tensions[index].toFixed(2)}</strong> lbs.
                            </p>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-center items-center flex-wrap md:flex-nowrap gap-x-4">
                    <button
                        className="bg-gray-500 text-white m-1 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                        onClick={resetToAverageTuning}
                    >
                        <span className="hidden md:block">Reset to Average Tuning</span>
                        <span className="block md:hidden">Reset</span>
                    </button>

                    <button
                        className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                        onClick={handleSubmit}
                    >
                        <span className="hidden md:block">{isEdit ? "Edit String Set" : "Add String Set to Instrument"}</span>
                        <span className="block md:hidden">{isEdit ? "Edit String Set" : "Add Set to Inst."}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AverageStringSet;