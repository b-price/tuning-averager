import React, { useState, useEffect, useRef } from 'react';
import {Instrument, InstType, Tuning} from "../../../types.ts";
import Modal from "./Modal.tsx";
import {round} from "../utils/calculate.ts";
import {
    DECIMAL_POINTS,
    defaultScales,
    defaultStrings,
    INST_PRESETS,
    SCALE_LENGTH_RANGE,
    STRING_RANGE
} from "../defaults.ts";

const defaultState = {
    name: '',
    selectedTunings: [],
    scale: 25.5,
    targetTension: [],
    type: "guitar"
}

interface InstrumentInputProps {
    onSubmit: ( instrument: Instrument ) => void;
    tunings: Tuning[];
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    editInstrument?: Instrument;
    onEdit: ( changes: object, instrument: Instrument ) => void;
}

const InstrumentInput: React.FC<InstrumentInputProps> = ({
     onSubmit, tunings,
     isOpen,
     onClose,
     isEdit,
     editInstrument,
     onEdit
}) => {
    const [name, setName] = useState(defaultState.name);
    const [selectedTunings, setSelectedTunings] = useState<Tuning[]>(defaultState.selectedTunings);
    const [scale, setScaleInternal] = useState(defaultState.scale);
    const [targetTension, setTargetTension] = useState<number[]>(defaultState.targetTension);
    const [type, setType] = useState<InstType>('guitar');
    const [useAverageTension, setUseAverageTension] = useState(false);
    const [averageTension, setAverageTension] = useState(0);
    const [isTuningDropdownOpen, setIsTuningDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [strings, setStringsInternal] = useState(defaultStrings.guitar);
    const [titleText, setTitleText] = useState('New Instrument');
    const [buttonText, setButtonText] = useState('Submit');

    const setStrings = (value: number) => {
        if (value >= STRING_RANGE[0] && value <= STRING_RANGE[1]) {
            setStringsInternal(value);
        }
    }

    const setScale = (value: number) => {
        if (value >= SCALE_LENGTH_RANGE[0] && value <= SCALE_LENGTH_RANGE[1]) {
            setScaleInternal(value);
        }
    }

    const resetFields = () => {
        setName(defaultState.name);
        setSelectedTunings(defaultState.selectedTunings);
        setScale(defaultState.scale);
        setStrings(defaultStrings.guitar);
        setTargetTension(INST_PRESETS[0].tensions.slice(0, strings));
        setType('guitar');
        setTitleText('New Instrument');
        setButtonText('Submit');
    }

    useEffect(() => {
        if (isEdit && editInstrument) {
            setName(editInstrument.name);
            setSelectedTunings(editInstrument.tunings);
            setScale(editInstrument.scale);
            setTargetTension(editInstrument.targetTension);
            setType(editInstrument.type);
            setTitleText(`Editing ${editInstrument.name}`);
            setButtonText('Save Changes');
        } else {
            resetFields();
        }
    }, [isEdit]);

    useEffect(() => {
        // Update default target tensions and average when strings or type change
        const defaultTensions = INST_PRESETS.find((preset) => preset.instrument === type && preset.forStrings.includes(strings))?.tensions;
        if (defaultTensions) {
            setTargetTension(defaultTensions.slice(0, strings));
            if (useAverageTension && defaultTensions.length > 0) {
                const avg = defaultTensions.reduce((a, b) => a + b, 0) / defaultTensions.length;
                setAverageTension(avg);
            }
        }
        setSelectedTunings([])
    }, [strings, type, useAverageTension]);

    const handleTensionChange = (index: number, value: number) => {
        if (!isNaN(value) && value !== undefined) {
            setTargetTension((prevTensions) => {
                const newTensions = [...prevTensions];
                newTensions[index] = value;
                return newTensions;
            });
            if (useAverageTension) {
                const avg = targetTension.reduce((a, b) => a + b, 0) / targetTension.length;
                setAverageTension(avg);
            }
        }

    };

    const handleTypeChange = (type: InstType) => {
        setType(type);
        setStrings(defaultStrings[type]);
        setScale(defaultScales[type]);
    }

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
            type: type,
            stringSets: []
        };
        if (isEdit && editInstrument) {
            instrument.id = editInstrument.id;
            instrument.stringSets = editInstrument.stringSets;
            const changes = {
                name: name,
                tunings: selectedTunings.map((tuning: Tuning) => tuning.id),
                targetTension: finalTargetTension,
            }
            onEdit(changes, instrument);
        } else {
            onSubmit(instrument);
        }
        onClose();
        resetFields();
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col px-8 pb-6 mx-auto">
                <h2 className="text-2xl font-bold mb-4">{titleText}</h2>

                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    {/*Desktop Column 1*/}
                    <div className="space-y-2 mx-2">
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
                                disabled={isEdit}
                                onChange={(e) => handleTypeChange(e.target.value as InstType)}
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
                                disabled={isEdit}
                                onChange={(e) => setStrings(parseInt(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Scale Length */}
                        <div>
                            <label className="block text-sm font-medium">Scale Length</label>
                            <input
                                type="number"
                                disabled={isEdit}
                                value={scale}
                                step={scale < 30 ? 0.25 : 1}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Tunings Dropdown Button */}
                        <div className="relative">
                            <button
                                onClick={() => setIsTuningDropdownOpen(!isTuningDropdownOpen)}
                                className="w-full mt-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
                            >
                                Select Tunings
                            </button>

                            {isTuningDropdownOpen && (
                                <div ref={dropdownRef}
                                     className="mt-2 py-2 w-full bg-gray-500 border border-gray-300 rounded-md shadow-lg z-10">
                                    {
                                        getFilteredTunings().length > 0 ? (
                                            getFilteredTunings().map((tuning) => (
                                                <label key={tuning.name} className="flex items-center px-4 ">
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
                    <div className="space-y-2 mt-2 mx-2">
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
                                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium">Use Average Tension</span>
                            </label>
                        </div>
                        {/* Target Tension Inputs */}
                        {useAverageTension ? (
                            <div>
                                <label className="block text-sm font-medium">Average Tension</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.2"
                                    value={round(averageTension, DECIMAL_POINTS)}
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
                                            min="0"
                                            step="0.2"
                                            value={tension}
                                            onChange={(e) => handleTensionChange(index, parseFloat(e.target.value))}
                                            className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <p className="ml-1">lbs.</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit}
                        className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{buttonText}
                </button>
            </div>
        </Modal>

    );
}

export default InstrumentInput;