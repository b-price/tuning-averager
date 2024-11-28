import {Instrument, StringSet} from "../../../types.ts";
import React, {useEffect, useState} from "react";
import Modal from "./Modal.tsx";
import {convertToNote, tension, uwFromGauge} from "../utils/calculate.ts";
import {notes, stringTypeFactors} from "../defaults.ts";
import ArrowSelector from "./ArrowSelector.tsx";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
    instrument?: Instrument;
}

interface Note {
    note: string;
    cents: number;
    noteValue: number;
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({stringSet, isOpen, onClose, onSubmit, instrument}) => {
    const [newGauges, setNewGauges] = useState<number[]>([]);
    const [woundStrings, setWoundStrings] = useState<boolean[]>([]);
    const [name, setName] = useState<string>('');
    const [tensions, setTensions] = useState<number[]>([]);
    const [noteObjects, setNoteObjects] = useState<Note[]>([]);

    useEffect(() => {
        if (isOpen){
            setNewGauges(stringSet.gauges);
            setWoundStrings(stringSet.woundStrings);
            setTensions(stringSet.tensions);
            setNoteObjects(stringSet.noteValues.map((noteValue) => convertToNote(noteValue)));
        }
    }, [isOpen, stringSet])

    const handleStringGaugeChange = (stringIndex: number, gauge: number) => {
        if (!isNaN(gauge)){
            setNewGauges((prevSet) => {
                const newSet = [...prevSet];
                newSet[stringIndex] = gauge;
                return newSet;
            })
            adjustTension(stringIndex, gauge, noteObjects[stringIndex].noteValue);
        }
    }

    const handleCentsChange = (stringIndex: number, cents: number) => {
        if (!isNaN(cents) && cents >= 0 && cents < 100){
            const noteValue = Math.floor(noteObjects[stringIndex].noteValue) + (cents / 100);
            const note = {
                note: noteObjects[stringIndex].note,
                cents: cents,
                noteValue: noteValue,
            }
            setNoteObjects((prevNotes) => {
                const newNotes = [...prevNotes];
                newNotes[stringIndex] = note;
                return newNotes;
            });
            adjustTension(stringIndex, newGauges[stringIndex], noteValue);
        }
    }

    const adjustTension = (stringIndex: number, gauge: number, noteValue: number) => {
        if (instrument) {
            setTensions((prevTensions) => {
                const newTensions = [...prevTensions];
                newTensions[stringIndex] = tension(uwFromGauge(
                    gauge,
                    stringTypeFactors[instrument.type][woundStrings[stringIndex] ? 'wound' : 'plain'].coeff,
                    stringTypeFactors[instrument.type][woundStrings[stringIndex] ? 'wound' : 'plain'].power
                ), noteValue, instrument.scale);
                return newTensions;
            })
        }
    }

    const handleNotesChange = (stringIndex: number, note: string | number) => {
        note = typeof note === 'number' ? note.toString() : note;
        const newNote = {note: note, cents: 0, noteValue: notes.indexOf(note)}
        setNoteObjects((prevNotes) => {
            const newNotes = [...prevNotes];
            newNotes[stringIndex] = newNote;
            return newNotes;
        });
        adjustTension(stringIndex, newGauges[stringIndex], newNote.noteValue);

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
            <div className="flex-col p-8 mx-auto bg-gray-600 rounded-xl shadow-md md:max-w-xl">
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
                <div className="grid grid-cols-5 gap-2 mb-4">

                    <label className="block text-sm font-medium">String</label>
                    <label className="block text-sm font-medium">Note</label>
                    <label className="block text-sm font-medium">Cents</label>
                    <label className="block text-sm font-medium">Gauge</label>
                    <label className="block text-sm font-medium">Tension</label>


                    {newGauges.map((gauge, index) => (
                        <div key={index} className="grid grid-cols-subgrid col-span-5 items-center ">
                            <label className="block text-sm font-medium mr-2">{index + 1}:</label>
                            <div className="w-3/4 scale-90">
                                <ArrowSelector
                                    key={index + noteObjects[index].note}
                                    options={notes}
                                    initialValue={noteObjects[index].note}
                                    onChange={(note) => (handleNotesChange(index, note))}
                                />
                            </div>

                            <input
                                type="number"
                                min="0"
                                max="99"
                                step="10"
                                value={noteObjects[index].cents}
                                onChange={(e) => handleCentsChange(index, parseFloat(e.target.value))}
                                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    min="0"
                                    step={gauge < 13 ? 0.5 : 1}
                                    value={gauge}
                                    onChange={(e) => handleStringGaugeChange(index, parseFloat(e.target.value))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="font-semibold ml-1">{woundStrings[index] ? "w" : "p"}</p>
                            </div>

                            <p className="">
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