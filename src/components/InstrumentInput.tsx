import React, { useState, useEffect, useRef } from 'react';
import { Instrument, Tuning } from "../types.ts";

interface InstrumentInputProps {
    onSubmit: (instrument: Instrument) => void;
    tunings: Tuning[];
    targetTensions: {
        guitar: number[];
        bass: number[];
        other: number[];
    };
    stringRange: [number, number]; // Added string range
}

const InstrumentInput: React.FC<InstrumentInputProps> = ({ onSubmit, tunings, targetTensions, stringRange }) => {
    const [name, setName] = useState('');
    const [selectedTunings, setSelectedTunings] = useState<Tuning[]>([]);
    const [scale, setScale] = useState(25.5); // Default scale length
    const [targetTension, setTargetTension] = useState<number[]>([]);
    const [type, setType] = useState<'guitar' | 'bass' | 'other'>('guitar');
    const [useAverageTension, setUseAverageTension] = useState(false);
    const [averageTension, setAverageTension] = useState(0);
    const [isTuningDropdownOpen, setIsTuningDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [strings, setStringsInternal] = useState(6); // Default to 6 strings

    const setStrings = (value: number) => {
        const [minStrings, maxStrings] = stringRange;
        if (value >= minStrings && value <= maxStrings) {
            setStringsInternal(value);
        }
    }
    useEffect(() => {
        // Update default target tensions and average when strings or type change
        const defaultTensions = targetTensions[type].slice(0, strings);
        setTargetTension(defaultTensions);

        if (useAverageTension && defaultTensions.length > 0) {
            const avg = defaultTensions.reduce((a, b) => a + b, 0) / defaultTensions.length;
            setAverageTension(avg);
        }
        setSelectedTunings([])
    }, [strings, type, targetTensions, useAverageTension]);

    const handleTensionChange = (index: number, value: number) => {
        setTargetTension((prevTensions) => {
            const newTensions = [...prevTensions];
            newTensions[index] = value;
            return newTensions;
        });
        if (useAverageTension) {
            const avg = targetTension.reduce((a, b) => a + b, 0) / targetTension.length;
            setAverageTension(avg);
        }
    };

    const handleTuningChange = (tuning: Tuning, checked: boolean) => {
        setSelectedTunings((prevTunings) =>
            checked ? [...prevTunings, tuning] : prevTunings.filter((t) => t !== tuning)
        );
    };

    const handleSubmit = () => {
        let finalTargetTension = targetTension;
        if (useAverageTension) {
            finalTargetTension = Array(strings).fill(averageTension);
        }

        const instrument: Instrument = {
            name,
            strings,
            tunings: selectedTunings,
            scale,
            targetTension: finalTargetTension,
            type: type
        };
        onSubmit(instrument);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTuningDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Function to filter tunings based on string count and type
    const getFilteredTunings = () => {
        const filteredTunings = tunings.filter(tuning =>
            tuning.strings.length === strings && tuning.type === type
        );
        return filteredTunings.length > 0 ? filteredTunings : [];
    };

    return (
        <div className="flex-col p-6 mx-auto bg-gray-700 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Instrument Input</h2>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4"> {/* Add vertical spacing between sections */}
                {/*Desktop Column 1*/}
                <div className="space-y-2">
                    {/* Instrument Name */}
                    <div>
                        <label className="block text-sm font-medium">Instrument Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Instrument Type */}
                    <div>
                        <label className="block text-sm font-medium">Instrument Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'guitar' | 'bass' | 'other')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="guitar">Guitar</option>
                            <option value="bass">Bass</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Number of Strings */}
                    <div>
                        <label className="block text-sm font-medium">Number of Strings</label>
                        <input
                            type="number"
                            value={strings}
                            onChange={(e) => setStrings(parseInt(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Scale Length */}
                    <div>
                        <label className="block text-sm font-medium">Scale Length</label>
                        <input
                            type="number"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Tunings Dropdown Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTuningDropdownOpen(!isTuningDropdownOpen)}
                            className="w-full mt-2 px-4 py-2 bg-blue-500 rounded-md"
                        >
                            Select Tunings
                        </button>

                        {isTuningDropdownOpen && (
                            <div ref={dropdownRef}
                                 className="absolute mt-2 py-2 w-full bg-gray-500 border border-gray-300 rounded-md shadow-lg z-10">
                                {
                                    getFilteredTunings().length > 0 ? (
                                        getFilteredTunings().map((tuning) => (
                                            <label key={tuning.name} className="flex items-center px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTunings.includes(tuning)}
                                                    onChange={(e) => handleTuningChange(tuning, e.target.checked)}
                                                />
                                                <span className="ml-2">{tuning.name}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <span className="block px-4 py-2">No valid tunings!</span>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>


                {/*Desktop Column 2*/}
                <div className="space-y-2 mt-2">
                    {/* Average Tension Switch */}
                    <div className="flex items-center mt-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useAverageTension}
                                onChange={(e) => setUseAverageTension(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use Average Tension</span>
                        </label>
                    </div>
                    {/* Target Tension Inputs */}
                    {useAverageTension ? (
                        <div>
                            <label className="block text-sm font-medium">Average Tension</label>
                            <input
                                type="number"
                                value={averageTension}
                                onChange={(e) => setAverageTension(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium">Target Tension (per string)</label>
                            {targetTension.map((tension, index) => (
                                <div key={index} className="flex items-center">
                                    <label className="block text-sm font-medium mr-2">{index + 1}:</label>
                                    <input
                                        type="number"
                                        value={tension}
                                        onChange={(e) => handleTensionChange(index, parseFloat(e.target.value))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit}
                    className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit
            </button>
        </div>
    );
}

export default InstrumentInput;