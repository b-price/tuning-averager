import React, { useState, useEffect } from "react";
import {
    InstPreset,
    Instrument,
    InstType,
    TensionPreset,
    Tuning,
} from "../../types.ts";
import Modal from "./Modal.tsx";
import DeleteConfirm from "./DeleteConfirm.tsx"; // Import DeleteConfirm component
import { getMultiscale, round } from "../utils/calculate.ts";
import {
    DECIMAL_POINTS,
    DEFAULT_SCALES,
    DEFAULT_STRING_COUNT,
    INST_PRESETS,
    MAX_TENSION,
    SCALE_LENGTH_RANGE,
    STRING_RANGE,
} from "../defaults.ts";
import ToggleSwitch from "./ToggleSwitch.tsx";
import DropdownButton from "./DropdownButton.tsx";
import { useMessage } from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";
import ArrowSelectorHorizontal from "./ArrowSelectorHorizontal.tsx";
import ArrowSelectorNumber from "./ArrowSelectorNumber.tsx";

const defaultState = {
    name: "",
    selectedTunings: [],
    scale: 25.5,
    targetTension: [],
    type: "guitar",
    scales: [25.5, 25.65, 25.8, 26.0, 26.25, 26.5],
    tensionPresets: [],
};

interface InstrumentInputProps {
    onSubmit: (instrument: Instrument) => void;
    tunings: Tuning[];
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    editInstrument?: Instrument;
    onEdit: (changes: object, instrument: Instrument) => void;
    tensionPresets: TensionPreset[];
    updateTensionPresets: (tensionPresets: TensionPreset[]) => Promise<void>;
    instrumentPresets: InstPreset[];
}

const InstrumentInput: React.FC<InstrumentInputProps> = ({
    onSubmit,
    tunings,
    isOpen,
    onClose,
    isEdit,
    editInstrument,
    onEdit,
    tensionPresets,
    updateTensionPresets,
    instrumentPresets,
}) => {
    const [name, setName] = useState(defaultState.name);
    const [selectedTunings, setSelectedTunings] = useState<Tuning[]>(
        defaultState.selectedTunings,
    );
    const [scale, setScaleInternal] = useState(defaultState.scale);
    const [targetTension, setTargetTension] = useState<number[]>(
        defaultState.targetTension,
    );
    const [type, setType] = useState<InstType>("guitar");
    const [useAverageTension, setUseAverageTension] = useState(false);
    const [averageTension, setAverageTension] = useState(1);
    const [strings, setStrings] = useState(DEFAULT_STRING_COUNT.guitar);
    const [titleText, setTitleText] = useState("New Instrument");
    const [buttonText, setButtonText] = useState("Submit");
    const [multiscale, setMultiscale] = useState<boolean>(false);
    const [scales, setScales] = useState<number[]>(defaultState.scales);
    const [presetNaming, setPresetNaming] = useState(false);
    const [presetName, setPresetName] = useState<string>("");
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<TensionPreset | null>(
        null,
    );
    const [errorState, setErrorState] = useState({
        name: false,
        strings: false,
        scale: false,
        scales: Array.from({ length: strings }, () => false),
        targetTension: Array.from({ length: strings }, () => false),
        averageTension: false,
    })
    const { message, messageType, showMessage, show, closeMessage } =
        useMessage();

    const setScale = (value: number) => {
        setScaleInternal(value);
        setErrorState({...errorState, scale: value < SCALE_LENGTH_RANGE[0] || value > SCALE_LENGTH_RANGE[1] });
    };

    const resetFields = () => {
        setName(defaultState.name);
        setSelectedTunings(defaultState.selectedTunings);
        setScale(defaultState.scale);
        setStrings(DEFAULT_STRING_COUNT.guitar);
        setTargetTension(
            INST_PRESETS[0].tensions.slice(0, DEFAULT_STRING_COUNT.guitar),
        );
        setType("guitar");
        setTitleText("New Instrument");
        setButtonText("Submit");
        setMultiscale(false);
        setScales(defaultState.scales);
        setErrorState({
            name: false,
            strings: false,
            scale: false,
            scales: Array.from({ length: strings }, () => false),
            targetTension: Array.from({ length: strings }, () => false),
            averageTension: false,
        })
    };

    useEffect(() => {
        if (isEdit && editInstrument) {
            setName(editInstrument.name);
            setStrings(editInstrument.strings);
            setTargetTension(editInstrument.targetTension);
            setType(editInstrument.type);
            setSelectedTunings(editInstrument.tunings);
            setScale(editInstrument.scale);
            setTitleText(`Editing ${editInstrument.name}`);
            setButtonText("Save Changes");
            if (editInstrument.isMultiscale && editInstrument.scales) {
                setMultiscale(editInstrument.isMultiscale);
                setScales(editInstrument.scales);
            }
        } else {
            resetFields();
        }
    }, [isEdit]);

    useEffect(() => {
        if (checkErrorState()) {
            showMessage('Invalid input!', 'error', Infinity);
        } else if (show && messageType === 'error') {
            closeMessage();
        }

    }, [errorState]);

    const checkErrorState = () => {
        return Object.values(errorState).flat().includes(true);
    }

    const handleTensionChange = (value: number, index: number) => {
        let error = true;
        if (!isNaN(value)) {
            setTargetTension((prevTensions) => {
                const newTensions = [...prevTensions];
                newTensions[index] = value;
                return newTensions;
            });
            if (useAverageTension) {
                const avg =
                    targetTension.reduce((a, b) => a + b, 0) /
                    targetTension.length;
                setAverageTension(avg);
                setErrorState({...errorState, averageTension: avg <= 0 || avg > MAX_TENSION})
            }
            error = value <= 0 || value > MAX_TENSION;
        }
        const newTensionErrors = [...errorState.targetTension];
        newTensionErrors[index] = error;
        setErrorState({...errorState, targetTension: newTensionErrors})
    };

    const handleAvTensionChange = (value: number) => {
        let error = true;
        if (!isNaN(value)) {
            setAverageTension(value);
            error = value <= 0 || value > MAX_TENSION;
        }
        setErrorState({...errorState, averageTension: error});
    };

    const handleAvTensionSwitch = (checked: boolean) => {
        setUseAverageTension(checked);
        const avg =
            targetTension.reduce((a, b) => a + b, 0) / targetTension.length;
        setAverageTension(avg);
    };

    const handleStringChange = (value: number) => {
        if (value >= STRING_RANGE[0] && value <= STRING_RANGE[1]) {
            setStrings(value);
            stringTypeChangeUpdate(value, type);
            setErrorState({ ...errorState, strings: false });
        } else {
            setStrings(value);
            setErrorState({ ...errorState, strings: true });
        }
    };

    const setToDefaultTensions = (stringCount: number, instType: InstType) => {
        const defaultTensions = INST_PRESETS.find(
            (preset) =>
                preset.instrument === instType &&
                preset.forStrings.includes(stringCount),
        )?.tensions.slice(0, stringCount);
        if (defaultTensions) {
            setTargetTension(defaultTensions);
            if (useAverageTension && defaultTensions.length > 0) {
                const avg =
                    defaultTensions.reduce((a, b) => a + b, 0) /
                    defaultTensions.length;
                setAverageTension(avg);
            }
        }
    };

    const stringTypeChangeUpdate = (newStrings: number, newType: InstType) => {
        setToDefaultTensions(newStrings, newType);
        setScales(getMultiscale(scale, newStrings));
        setSelectedTunings([]);
    };

    const handleTypeChange = (newType: InstType) => {
        setType(newType);
        setStrings(DEFAULT_STRING_COUNT[newType]);
        setScale(DEFAULT_SCALES[newType]);
        stringTypeChangeUpdate(DEFAULT_STRING_COUNT[newType], newType);
    };

    const handleTuningChange = (tuning: Tuning, checked: boolean) => {
        setSelectedTunings((prevTunings) =>
            checked
                ? [...prevTunings, tuning]
                : prevTunings.filter((t) => t !== tuning),
        );
    };

    const handleSubmit = () => {
        if (name === "") {
            showMessage("Name is required!", "error");
        } else if (checkErrorState()) {
            showMessage('Cannot submit, please enter valid inputs!', 'error')
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
                scales,
            };
            if (isEdit && editInstrument) {
                instrument.id = editInstrument.id;
                instrument.stringSets = editInstrument.stringSets;
                const changes = {
                    name: name,
                    tunings: selectedTunings.map((tuning: Tuning) => tuning.id),
                    targetTension: finalTargetTension,
                };
                onEdit(changes, instrument);
            } else {
                onSubmit(instrument);
            }
            onClose();
            resetFields();
        }
    };

    const handleDeleteTensionPreset = (deletePre: TensionPreset) => {
        setPresetToDelete(deletePre);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteTensionPreset = () => {
        if (presetToDelete) {
            const newPresets = tensionPresets.filter(
                (preset) => preset.name !== presetToDelete.name,
            );
            updateTensionPresets(newPresets)
                .then(() => showMessage("Tension preset deleted.", "success"))
                .catch(() =>
                    showMessage("Unable to delete tension preset.", "error"),
                );
            setIsDeleteConfirmOpen(false);
        }
    };

    const handleAddTensionPreset = () => {
        if (presetName.length <= 0) {
            showMessage("Preset name is required!", "error");
        } else if (
            tensionPresets.map((preset) => preset.name).includes(presetName)
        ) {
            showMessage("Preset name already in use!", "error");
        } else {
            const preset: TensionPreset = {
                name: presetName,
                tensions: useAverageTension
                    ? Array(strings).fill(averageTension)
                    : targetTension,
                type: type,
            };
            const newPresets = [...tensionPresets, preset];
            updateTensionPresets(newPresets)
                .then(() => {
                    showMessage("Tension preset saved!", "success");
                    setPresetNaming(false);
                })
                .catch((err) =>
                    showMessage(
                        "Unable to save tension preset: " + err,
                        "error",
                    ),
                );
        }
    };

    const handleLoadPresetTension = (tension: TensionPreset) => {
        if (useAverageTension) {
            setAverageTension(
                tension.tensions.reduce((a, b) => a + b, 0) /
                    tension.tensions.length,
            );
        }
        setTargetTension(tension.tensions);
    };

    const getFilteredTunings = () => {
        const filteredTunings = tunings.filter(
            (tuning) =>
                tuning.strings.length === strings && tuning.type === type,
        );
        return filteredTunings.length > 0 ? filteredTunings : [];
    };

    const getFilteredTensionPresets = () => {
        const filteredPresets = tensionPresets.filter(
            (preset) =>
                preset.tensions.length === strings && preset.type === type,
        );
        return filteredPresets.length > 0 ? filteredPresets : [];
    };

    const handleMultiscaleChange = (value: number, index: number) => {
        const newScalesErrors = [...errorState.scales];
        const newScales = [...scales];
        newScales[index] = value;
        setScales(newScales);
        newScalesErrors[index] = value < SCALE_LENGTH_RANGE[0] || value > SCALE_LENGTH_RANGE[1];
        setErrorState({...errorState, scales: newScalesErrors});
    };

    const handleMultiscale = (checked: boolean) => {
        setMultiscale(checked);
        if (checked) {
            setScales(getMultiscale(scale, strings));
        } else {
            setScale(scales[0]);
        }
    };

    const handlePresetChange = (id: string) => {
        const newPreset = instrumentPresets.find((preset) => preset.id === id);
        if (newPreset) {
            const stringCount =
                newPreset.forStrings.length === 1
                    ? newPreset.forStrings[0]
                    : newPreset.forStrings.includes(
                            DEFAULT_STRING_COUNT[newPreset.instrument],
                        )
                      ? DEFAULT_STRING_COUNT[newPreset.instrument]
                      : newPreset.forStrings[0];
            setType(newPreset.instrument);
            setScale(newPreset.scale);
            setTargetTension(newPreset.tensions.slice(0, stringCount));
            setStrings(stringCount);
            setSelectedTunings([]);
        }
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
                            <label className="block text-sm font-medium">
                                Instrument Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                            />
                        </div>

                        {/* Instrument Type */}
                        <div>
                            <label className="block text-sm font-medium">
                                Instrument Type
                            </label>
                            <select
                                value={type}
                                disabled={isEdit}
                                onChange={(e) =>
                                    handleTypeChange(e.target.value as InstType)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                            >
                                <option value="guitar">Guitar</option>
                                <option value="bass">Bass</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Number of Strings */}
                        <div className="pb-0 grid">
                            <label className="block text-sm font-medium mb-1">
                                Number of Strings
                            </label>
                            <div className=" justify-self-center w-2/3">
                                <ArrowSelectorNumber
                                    min={STRING_RANGE[0]}
                                    max={STRING_RANGE[1]}
                                    step={1}
                                    value={strings}
                                    onChange={(count) =>
                                        handleStringChange(count)
                                    }
                                    disabled={isEdit}
                                    errorState={errorState.strings}
                                    input={true}
                                />
                            </div>
                        </div>

                        {/* Scale Length */}
                        <div className="flex justify-center mt-0">
                            <ToggleSwitch
                                checked={multiscale}
                                onChange={(e) => handleMultiscale(e.target.checked)}
                                disabled={isEdit}
                            >
                            <span className="ml-3 text-sm font-medium">
                                Multiscale
                            </span>
                            </ToggleSwitch>
                        </div>

                        <div>
                            <div
                                className={`transition-all duration-500 ease-in-out ${multiscale ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 invisible"}`}
                            >
                                <label className="block text-sm font-medium">
                                    Scale Lengths
                                </label>
                                {multiscale &&
                                    scales.map((length, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center mt-1"
                                        >
                                            <label className="px-2">
                                                {index + 1}:
                                            </label>
                                            <ArrowSelectorHorizontal
                                                min={SCALE_LENGTH_RANGE[0]}
                                                max={SCALE_LENGTH_RANGE[1]}
                                                step={scale < 30 ? 0.25 : 1}
                                                value={round(
                                                    length,
                                                    DECIMAL_POINTS + 1,
                                                )}
                                                onChange={(len) =>
                                                    handleMultiscaleChange(
                                                        len,
                                                        index,
                                                    )
                                                }
                                                disabled={isEdit}
                                                errorState={
                                                    errorState.scales[index]
                                                }
                                                input={true}
                                            />
                                            <label className="px-1">in.</label>
                                        </div>
                                    ))}
                            </div>
                            <div
                                className={`transition-all duration-500 ease-in-out ${multiscale ? "opacity-0 max-h-0 invisible" : "opacity-100 max-h-screen"}`}
                            >
                                <label className="block text-sm font-medium">
                                    Scale Length (in.)
                                </label>
                                {!multiscale && (
                                    <div className="flex items-center justify-center mt-1">
                                        <div className="w-2/3">
                                            <ArrowSelectorNumber
                                                min={SCALE_LENGTH_RANGE[0]}
                                                max={SCALE_LENGTH_RANGE[1]}
                                                step={scale < 30 ? 0.25 : 1}
                                                value={round(
                                                    scale,
                                                    DECIMAL_POINTS + 1,
                                                )}
                                                onChange={(len) =>
                                                    setScale(len)
                                                }
                                                disabled={isEdit}
                                                errorState={errorState.scale}
                                                input={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tunings Dropdown Button */}

                        <DropdownButton
                            id="tunings-button"
                            buttonText="Select Tunings"
                        >
                            {getFilteredTunings().length > 0 ? (
                                getFilteredTunings().map((tuning) => (
                                    <label
                                        key={tuning.id}
                                        className="flex items-center px-4"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTunings
                                                .map((t) => t.id)
                                                .includes(tuning.id)}
                                            onChange={(e) =>
                                                handleTuningChange(
                                                    tuning,
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="ml-2">
                                            {tuning.name}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <span className="block px-4 py-2">
                                    No valid tunings!
                                </span>
                            )}
                        </DropdownButton>

                        {/*Instrument Presets*/}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Use Preset
                            </label>
                            <select
                                onChange={(e) =>
                                    handlePresetChange(e.target.value)
                                }
                                disabled={
                                    !instrumentPresets ||
                                    instrumentPresets.length === 0
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                            >
                                {isEdit && editInstrument
                                    ? instrumentPresets
                                          .filter(
                                              (insPre) =>
                                                  insPre.instrument ===
                                                      editInstrument.type &&
                                                  insPre.forStrings.includes(
                                                      editInstrument.strings,
                                                  ) &&
                                                  insPre.scale ===
                                                      editInstrument.scale,
                                          )
                                          .map((ipre) => (
                                              <option
                                                  key={ipre.id}
                                                  value={ipre.id}
                                              >
                                                  {ipre.name}
                                              </option>
                                          ))
                                    : instrumentPresets.map((insPre) => (
                                          <option
                                              key={insPre.id}
                                              value={insPre.id}
                                          >
                                              {insPre.name}
                                          </option>
                                      ))}
                            </select>
                        </div>
                    </div>

                    {/*Desktop Column 2*/}
                    <div className="space-y-2 mt-2 mx-2">
                        <ToggleSwitch
                            checked={useAverageTension}
                            onChange={(e) =>
                                handleAvTensionSwitch(e.target.checked)
                            }
                        >
                            <span className="ml-3 text-sm font-medium">
                                Use Balanced Tension
                            </span>
                        </ToggleSwitch>

                        {/* Target Tension Inputs */}
                        <div
                            className={`transition-all duration-500 ease-in-out ${useAverageTension ? "opacity-0 max-h-0 invisible" : "opacity-100 max-h-screen"}`}
                        >
                            <label className="block text-sm font-medium">
                                Target Tension (per string)
                            </label>
                            {targetTension.map((tension, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center mt-1"
                                >
                                    <label className="block text-sm font-medium mr-2">
                                        {index + 1}:
                                    </label>
                                    <ArrowSelectorHorizontal
                                        min={0}
                                        max={MAX_TENSION}
                                        step={0.2}
                                        value={round(tension, DECIMAL_POINTS)}
                                        onChange={(ten) =>
                                            handleTensionChange(ten, index)
                                        }
                                        errorState={
                                            errorState.targetTension[index]
                                        }
                                        input={true}
                                    />
                                    <p className="ml-1">lbs.</p>
                                </div>
                            ))}
                        </div>

                        <div
                            className={`transition-all duration-500 ease-in-out ${useAverageTension ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 invisible"}`}
                        >
                            <label className="block text-sm font-medium">
                                Target Tension (per string)
                            </label>
                            <div className="flex items-center justify-center mt-1">
                                <ArrowSelectorHorizontal
                                    min={0}
                                    max={MAX_TENSION}
                                    step={0.2}
                                    value={round(
                                        averageTension,
                                        DECIMAL_POINTS,
                                    )}
                                    onChange={(ten) =>
                                        handleAvTensionChange(ten)
                                    }
                                    errorState={errorState.averageTension}
                                    input={true}
                                />
                                <p className="ml-1">lbs.</p>
                            </div>
                        </div>

                        {/*Tension Preset Saving*/}

                        <div
                            className={`space-y-2 transition-all duration-500 ease-in-out ${presetNaming ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 invisible"}`}
                        >
                            <label className="block text-sm font-medium">
                                Preset Name
                            </label>
                            <input
                                type="text"
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                className="px-3 py-2 my-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleAddTensionPreset()}
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
                            className={`transition-all duration-500 ease-in-out ${presetNaming ? "opacity-0 max-h-0 visible" : "opacity-100 max-h-screen"}`}
                        >
                            <button
                                onClick={() => setPresetNaming(true)}
                                className={`mt-2 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 `}
                            >
                                Save Tensions
                            </button>
                        </div>

                        {/*Tension Presets*/}

                        <DropdownButton
                            id="tension-menu"
                            buttonText="Tension Presets"
                        >
                            <div className="flex justify-between">
                                <button
                                    className="bg-indigo-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                    onClick={() =>
                                        setToDefaultTensions(strings, type)
                                    }
                                >
                                    Default
                                </button>
                            </div>
                            {getFilteredTensionPresets().map(
                                (preset, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between"
                                    >
                                        <button
                                            className="bg-indigo-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                            onClick={() =>
                                                handleLoadPresetTension(preset)
                                            }
                                        >
                                            {preset.name}
                                        </button>
                                        <button
                                            className="bg-red-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                            onClick={() =>
                                                handleDeleteTensionPreset(
                                                    preset,
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ),
                            )}
                        </DropdownButton>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="mt-6 sm:w-1/2 w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-400 block sm:hidden"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="mt-6 sm:w-1/2 w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-400"
                    >
                        {buttonText}
                    </button>
                </div>

                <Alert
                    show={show}
                    message={message}
                    type={messageType}
                    onClose={closeMessage}
                    style="mt-4"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                deleteFunction={confirmDeleteTensionPreset}
            />
        </Modal>
    );
};

export default InstrumentInput;
