import React, { useState, useEffect } from 'react';
import {Instrument, InstType, TensionPreset, Tuning} from "../../../types.ts";
import Modal from "../aicomponents/Modal.tsx";
import {getMultiscale, round} from "../utils/calculate.ts";
import {
    DECIMAL_POINTS,
    defaultScales,
    defaultStrings,
    INST_PRESETS,
    SCALE_LENGTH_RANGE,
    STRING_RANGE
} from "../defaults.ts";
import ToggleSwitch from "../aicomponents/ToggleSwitch.tsx";
import DropdownButton from "../aicomponents/DropdownButton.tsx";
import {useMessage} from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";

const defaultState = {
    name: '',
    selectedTunings: [],
    scale: 25.5,
    targetTension: [],
    type: "guitar",
    scales: [25.5, 25.65, 25.8, 26.0, 26.25, 26.5],
    tensionPresets: []
}

interface InstrumentInputProps {
    onSubmit: ( instrument: Instrument ) => void;
    tunings: Tuning[];
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    editInstrument?: Instrument;
    onEdit: ( changes: object, instrument: Instrument ) => void;
    tensionPresets: TensionPreset[];
    updateTensionPresets: ( changes: object ) => void;
}

const InstrumentInput: React.FC<InstrumentInputProps> = ({
                                                             onSubmit, tunings,
                                                             isOpen,
                                                             onClose,
                                                             isEdit,
                                                             editInstrument,
                                                             onEdit,
                                                             tensionPresets,
                                                             updateTensionPresets,
                                                         }) => {
    const [name, setName] = useState(defaultState.name);
    const [selectedTunings, setSelectedTunings] = useState<Tuning[]>(defaultState.selectedTunings);
    const [scale, setScaleInternal] = useState(defaultState.scale);
    const [targetTension, setTargetTension] = useState<number[]>(defaultState.targetTension);
    const [type, setType] = useState<InstType>('guitar');
    const [useAverageTension, setUseAverageTension] = useState(false);
    const [averageTension, setAverageTension] = useState(0);
    const [strings, setStrings] = useState(defaultStrings.guitar);
    const [titleText, setTitleText] = useState('New Instrument');
    const [buttonText, setButtonText] = useState('Submit');
    const [multiscale, setMultiscale] = useState<boolean>(false);
    const [scales, setScales] = useState<number[]>(defaultState.scales);
    const [presetNaming, setPresetNaming] = useState(false);
    const [presetName, setPresetName] = useState<string>('');
    const { message, messageType, showMessage } = useMessage();

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

    const setToDefaultTensions = (stringCount: number, instType: InstType) => {
        const defaultTensions = INST_PRESETS
            .find((preset) => preset.instrument === instType && preset.forStrings.includes(stringCount))?.tensions
            .slice(0, stringCount);
        if (defaultTensions) {
            setTargetTension(defaultTensions);
            if (useAverageTension && defaultTensions.length > 0) {
                const avg = defaultTensions.reduce((a, b) => a + b, 0) / defaultTensions.length;
                setAverageTension(avg);
            }
        }
    }

    const stringTypeChangeUpdate = (newStrings: number, newType: InstType) => {
        setToDefaultTensions(newStrings, newType);
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
        if (name === ''){
            showMessage('Name is required!', 'error');
        } else {
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
        }

    };

    const handleDeleteTensionPreset = (deletePre: TensionPreset) => {
        const newPresets = tensionPresets.filter(preset => preset.name !== deletePre.name);
        updateTensionPresets(newPresets);
    }

    const handleAddTensionPreset = () => {
        const preset: TensionPreset = { name: presetName, tensions: targetTension, type: type };
        const newPresets = [...tensionPresets, preset];
        updateTensionPresets(newPresets);
        setPresetNaming(false);
    }

    // Function to filter tunings based on string count and type
    const getFilteredTunings = () => {
        const filteredTunings = tunings.filter(tuning =>
            tuning.strings.length === strings && tuning.type === type
        );
        return filteredTunings.length > 0 ? filteredTunings : [];
    };

    const getFilteredTensionPresets = () => {
        const filteredPresets = tensionPresets.filter(preset =>
            preset.tensions.length === strings && preset.type === type
        );
        return filteredPresets.length > 0 ? filteredPresets : [];
    }

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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm justify-self-center"
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
                                    <div key={index} className="flex items-center justify-center">
                                        <label className="px-2">{index + 1}:</label>
                                        <input
                                            type="number"
                                            disabled={isEdit}
                                            value={round(length, DECIMAL_POINTS + 1)}
                                            step={0.125}
                                            onChange={(e) => handleMultiscaleChange(parseFloat(e.target.value), index)}
                                            className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <label className="px-1">in.</label>
                                    </div>
                                ))
                                :
                                <div className="flex items-center justify-center">
                                    <input
                                        type="number"
                                        disabled={isEdit}
                                        value={scale}
                                        step={scale < 30 ? 0.25 : 1}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <label className="px-1">in.</label>
                                </div>
                            }
                        </div>

                        {/* Tunings Dropdown Button */}

                        <DropdownButton id="tunings-button" buttonText="Select Tunings">
                            {
                                getFilteredTunings().length > 0 ? (
                                    getFilteredTunings().map((tuning) => (
                                        <label key={tuning.id} className="flex items-center px-4">
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
                        </DropdownButton>

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
                        <div className={`transition-all duration-500 ease-in-out ${useAverageTension ? "opacity-0 max-h-0 invisible" : "opacity-100 max-h-screen"}`}>
                            <label className="block text-sm font-medium">Target Tension (per string)</label>
                            {targetTension.map((tension, index) => (
                                <div key={index} className="flex items-center justify-center">
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

                        <div className={`transition-all duration-500 ease-in-out ${useAverageTension ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 invisible"}`}>
                            <label className="block text-sm font-medium">Average Tension</label>
                            <div className="flex items-center justify-center">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.2"
                                    value={round(averageTension, DECIMAL_POINTS)}
                                    onChange={(e) => setAverageTension(parseFloat(e.target.value))}
                                    className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="ml-1">lbs.</p>
                            </div>
                        </div>

                        {/*Tension Preset Saving*/}

                        <div
                            className={`space-y-2 transition-all duration-500 ease-in-out ${presetNaming ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 invisible"}`}>
                            <label className="block text-sm font-medium">Preset Name</label>
                            <input
                                type="text"
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                className="px-3 py-2 my-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="flex items-center justify-between">
                                <button onClick={() => handleAddTensionPreset()}
                                        className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-400"
                                >
                                    Save
                                </button>
                                <button
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                    onClick={() => setPresetNaming(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div
                            className={`transition-all duration-500 ease-in-out ${presetNaming ? "opacity-0 max-h-0 visible" : "opacity-100 max-h-screen"}`}>
                            <button onClick={() => setPresetNaming(true)}
                                    className={`mt-2 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 `}
                            >
                            Save Tensions
                            </button>
                        </div>

                        {/*Tension Presets*/}

                        <DropdownButton id="tension-menu" buttonText="Tension Presets">
                            <div className="flex justify-between">
                                <button
                                    className="bg-indigo-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                    onClick={() => setToDefaultTensions(strings, type)}
                                >
                                    Default
                                </button>
                            </div>
                            {
                                getFilteredTensionPresets().map((preset, index) => (
                                    <div key={index} className="flex justify-between">
                                        <button
                                            className="bg-indigo-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                            onClick={() => setTargetTension(preset.tensions)}
                                        >
                                            Default
                                        </button>
                                        <button
                                            className="bg-red-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                            onClick={() => handleDeleteTensionPreset(preset)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))

                            }
                        </DropdownButton>
                    </div>
                </div>

                {/* Submit Button */}
                <button onClick={handleSubmit}
                        className="mt-6 sm:w-1/2 w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-400">{buttonText}
                </button>

                <Alert show={!!message} message={message} type={messageType} style="mt-4" />
            </div>
        </Modal>
    );
}

export default InstrumentInput;