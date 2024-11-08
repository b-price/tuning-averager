import React, { useState, } from 'react';
import ArrowSelector from './ArrowSelector.tsx';
import { GuitarString, Tuning, Transpose } from "../types.ts";

interface TuningInputProps {
    notes: string[];
    presetTunings: Tuning[];
    defaultTunings: { guitar: GuitarString[], bass: GuitarString[], other: GuitarString[] };
    onSubmit: (tuning: Tuning) => void;
}

const InputTuningFixes: React.FC<TuningInputProps> = ({notes, presetTunings, defaultTunings, onSubmit}) => {
    const [strings, setStrings] = useState<GuitarString[]>(defaultTunings.guitar.slice(0, -3));
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<'guitar' | 'bass' | 'other'>('guitar');
    const [stringCount, setStringCount] = useState<number>(6);
    const [transpose, setTranspose] = useState<Transpose>({prev: 0, current: 0});
    const [tunings, setTunings] = useState<Tuning[]>(presetTunings);

    const handleNoteChange = (index: number, note: string | number) => {
        note = typeof note === 'number' ? note.toString() : note;
        const newStrings = [...strings];
        newStrings[index] = { note, noteValue: notes.indexOf(note) };
        setStrings(newStrings);
    };

    const handleSubmit = () => {
        const submittedTuning: Tuning = {
            name,
            strings,
            type,
        };
        setTunings([...tunings, submittedTuning]);
        onSubmit(submittedTuning);
    };

    const handleStringCountChange = (count: number | string, newType: 'guitar' | 'bass' | 'other') => {
        count = typeof count === 'number' ? count : parseInt(count)
        const newStrings = defaultTunings[newType].slice(0, count) || defaultTunings.guitar.slice(0, -3);
        setTranspose({prev: 0, current: 0}); // Reset transpose when changing instrument
        setStrings(newStrings);
        setStringCount(count);

    };

    const handleTypeChange = (newType: 'guitar' | 'bass' | 'other') => {
        setType(newType);
        let standardAmount = 4;
        switch (newType) {
            case 'guitar':
                standardAmount = 6;
                break;
            case "bass":
                standardAmount = 4;
                break;
            default:
        }
        handleStringCountChange(standardAmount, newType);
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTuning = tunings.find(t => t.name === e.target.value);
        if (selectedTuning) {
            setStrings(selectedTuning.strings);
            setType(selectedTuning.type);
            setStringCount(selectedTuning.strings.length);
            setName(selectedTuning.name);
            setTranspose({prev: 0, current: 0}); // Reset transpose when loading a preset
        }
    };

    const handleTranspose = (trans: number | string) => {
        trans = typeof trans === 'number' ? trans : parseInt(trans)
        const prev = transpose.current;
        setTranspose({prev: prev, current: trans});
        const step = trans - prev;
        const newStrings = strings.map(str => {
            const newNoteValue = str.noteValue + step;
            const newNoteIndex = newNoteValue >= 0 && newNoteValue < notes.length ? newNoteValue : str.noteValue;
            return { note: notes[newNoteIndex], noteValue: newNoteIndex };
        });
        setStrings(newStrings);
    }

    return (
        <div className="max-w-md mx-auto">
            {/*Title*/}
            <h2 className="text-2xl font-bold mb-4">Guitar Tuning Input</h2>
            {/* Desktop Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Column 1: String Notes */}
                <div>
                    <label className="block text-sm font-medium mb-2">Strings</label>
                    <div className="grid gap-2 mb-6 sm:mb-0 place-items-center">
                        {strings.map((str, index) => (
                            <div key={index + str.note} className="col-span-1 sm:w-1/2 w-2/5">
                                <ArrowSelector
                                    key={str.noteValue}
                                    options={notes}
                                    initialValue={str.note}
                                    onChange={(note) => handleNoteChange(index, note)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: String Count, Transpose, Instrument, Preset, Tuning Name */}
                <div>
                    <div className="flex">
                        {/* String Count/Transpose (labels on top) */}
                        <div className="mb-4 flex-grow px-2">
                            <label className="block text-sm font-medium mb-2">String Count</label>
                            <ArrowSelector
                                key={stringCount + 'S'}
                                options={[3, 4, 5, 6, 7, 8, 9]}
                                initialValue={stringCount}
                                onChange={(count) => handleStringCountChange(count, type)}
                            />
                        </div>
                        <div className="mb-4 flex-grow px-2">
                            <label className="block text-sm font-medium mb-2">Transpose</label>
                            <ArrowSelector
                                key={transpose.current + 'T'}
                                options={[-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                                initialValue={transpose.current}
                                onChange={(value) => handleTranspose(value)}
                            />
                        </div>
                    </div>
                    {/*Instrument Type*/}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Instrument</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                handleTypeChange(e.target.value as 'guitar' | 'bass' | 'other')
                            }}
                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="guitar">Guitar</option>
                            <option value="bass">Bass</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/*Preset*/}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Preset</label>
                        <select
                            onChange={handlePresetChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {tunings.map((t, index) => (
                                <option key={index + t.name} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    {/*Name*/}
                    <div className="mb-8">
                        <label className="block text-sm font-medium">Tuning Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tuning Name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/*Submit*/}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-indigo-600 text-white">Submit
                    </button>
                </div>
            </div>


        </div>
    );
};

export default InputTuningFixes;