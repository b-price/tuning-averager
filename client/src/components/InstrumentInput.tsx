import React, { useState, useEffect, useRef } from 'react';
import {Instrument, InstType, Tuning} from "../../../types.ts";
import Modal from "./Modal.tsx";
import {getMultiscale, round} from "../utils/calculate.ts";
import {
    DECIMAL_POINTS,
    defaultScales,
    defaultStrings,
    INST_PRESETS,
    SCALE_LENGTH_RANGE,
    STRING_RANGE
} from "../defaults.ts";
import ToggleSwitch from "./ToggleSwitch.tsx";

const defaultState = {
    name: '',
    selectedTunings: [],
    scale: 25.5,
    targetTension: [],
    type: "guitar",
    scales: [25.5, 25.65, 25.8, 26.0, 26.25, 26.5]
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
    const [strings, setStrings] = useState(defaultStrings.guitar);
    const [titleText, setTitleText] = useState('New Instrument');
    const [buttonText, setButtonText] = useState('Submit');
    const [multiscale, setMultiscale] = useState<boolean>(false);
    const [scales, setScales] = useState<number[]>(defaultState.scales);

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
        setTargetTension(INST_PRESETS[0].tensions.slice(0, defaultStrings.guitar));
        setType('guitar');
        setTitleText('New Instrument');
        setButtonText('Submit');
        setMultiscale(false);
        setScales(defaultState.scales);
    }

    useEffect(() => {
        if (isEdit && editInstrument) {
            setName(editInstrument.name);
            setStrings(editInstrument.strings)
            setTargetTension(editInstrument.targetTension);
            setType(editInstrument.type);
            setSelectedTunings(editInstrument.tunings);
            setScale(editInstrument.scale);
            setTitleText(`Editing ${editInstrument.name}`);
            setButtonText('Save Changes');
            if (editInstrument.isMultiscale && editInstrument.scales) {
                setMultiscale(editInstrument.isMultiscale);
                setScales(editInstrument.scales);
            }
        } else {
            resetFields();
        }
    }, [isEdit]);

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

    const handleAvTensionSwitch = (checked: boolean) => {
        setUseAverageTension(checked);
        const avg = targetTension.reduce((a, b) => a + b, 0) / targetTension.length;
        setAverageTension(avg);
    }

    const handleStringChange = (value: number) => {
        if (value >= STRING_RANGE[0] && value <= STRING_RANGE[1]) {
            setStrings(value);
            stringTypeChangeUpdate(value, type);
        }
    }

    const stringTypeChangeUpdate = (newStrings: number, newType: InstType) => {
        const defaultTensions = INST_PRESETS
            .find((preset) => preset.instrument === newType && preset.forStrings.includes(newStrings))?.tensions
            .slice(0, newStrings);
        if (defaultTensions) {
            setTargetTension(defaultTensions);
            if (useAverageTension && defaultTensions.length > 0) {
                const avg = defaultTensions.reduce((a, b) => a + b, 0) / defaultTensions.length;
                setAverageTension(avg);
            }
        }
        setScales(getMultiscale(scale, newStrings));
        setSelectedTunings([]);
    }

    const handleTypeChange = (type: InstType) => {
        setType(type);
        setStrings(defaultStrings[type]);
        setScale(defaultScales[type]);
        stringTypeChangeUpdate(strings, type);
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
            stringSets: [],
            isMultiscale: multiscale,
            scales
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

    const handleMultiscaleChange = (value: number, index: number) => {
        if (value >= SCALE_LENGTH_RANGE[0] && value <= SCALE_LENGTH_RANGE[1]){
            const newScales = [...scales];
            newScales[index] = value;
            setScales(newScales);
        }
    }

    const handleMultiscale = (checked: boolean) => {
        setMultiscale(checked);
        if (checked){
            setScales(getMultiscale(scale, strings));
        } else {
            setScale(scales[0]);
        }
    }

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
                        <div className="pb-2">
                            <label className="block text-sm font-medium">Number of Strings</label>
                            <input
                                type="number"
                                value={strings}
                                disabled={isEdit}
                                onChange={(e) => handleStringChange(parseInt(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Scale Length */}

                        <ToggleSwitch
                            checked={multiscale}
                            onChange={(e) => handleMultiscale(e.target.checked)}
                            disabled={isEdit}
                        >
                            <span className="ml-3 text-sm font-medium">Multiscale</span>
                        </ToggleSwitch>
                        <div>
                            <label className="block text-sm font-medium">Scale Length</label>
                            {multiscale ? scales.map((length, index) => (
                                    <div key={index} className="flex items-center">
                                        <label className="px-2">{index + 1}:</label>
                                        <input
                                            type="number"
                                            disabled={isEdit}
                                            value={round(length, DECIMAL_POINTS + 1)}
                                            step={0.125}
                                            onChange={(e) => handleMultiscaleChange(parseFloat(e.target.value), index)}
                                            className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <label className="px-2">in.</label>
                                    </div>
                                ))
                                :
                                <input
                                    type="number"
                                    disabled={isEdit}
                                    value={scale}
                                    step={scale < 30 ? 0.25 : 1}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            }
                        </div>

                        {/* Tunings Dropdown Button */}
                        <div className="relative">
                            <button
                                onClick={() => setIsTuningDropdownOpen(!isTuningDropdownOpen)}
                                className="w-full mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-400"
                            >
                                Select Tunings
                            </button>

                            {isTuningDropdownOpen && (
                                <div ref={dropdownRef}
                                     className="mt-2 py-2 w-full dark:bg-gray-500 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    {
                                        getFilteredTunings().length > 0 ? (
                                            getFilteredTunings().map((tuning) => (
                                                <label key={tuning.id} className="flex items-center px-4 ">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTunings.map((t) => t.id).includes(tuning.id)}
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
                        <ToggleSwitch
                            checked={useAverageTension}
                            onChange={(e) => handleAvTensionSwitch(e.target.checked)}
                        >
                            <span className="ml-3 text-sm font-medium">Use Average Tension</span>
                        </ToggleSwitch>

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
                        className="mt-6 sm:w-1/2 w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-400">{buttonText}
                </button>
            </div>
        </Modal>

    );
}

export default InstrumentInput;