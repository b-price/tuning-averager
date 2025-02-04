import React, { useEffect, useState } from "react";
import ArrowSelector from "./ArrowSelector.tsx";
import { GuitarString, Tuning, Transpose, InstType } from "../../types.ts";
import Modal from "./Modal.tsx";
import { capitalize } from "../utils/calculate.ts";
import {
    DEFAULT_STRING_COUNT,
    INST_PRESETS, MAX_TRANSPOSE, STRING_RANGE,
} from "../defaults.ts";
import ArrowSelectorNumber from "./ArrowSelectorNumber.tsx";
import {useMessage} from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";

interface TuningInputProps {
    notes: string[];
    presetTunings?: Tuning[];
    onSubmit: (tuning: Tuning) => void;
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    editTuning?: Tuning;
    onEdit: (changes: object, tuning: Tuning) => void;
}

const TuningInput: React.FC<TuningInputProps> = ({
    notes,
    presetTunings,
    onSubmit,
    isOpen,
    onClose,
    isEdit,
    editTuning,
    onEdit,
}) => {
    const [strings, setStrings] = useState<GuitarString[]>(
        INST_PRESETS[0].tuning.strings.slice(0, 6),
    );
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<InstType>("guitar");
    const [stringCount, setStringCount] = useState<number>(6);
    const [transpose, setTranspose] = useState<Transpose>({
        prev: 0,
        current: 0,
    });
    const [tunings, setTunings] = useState<Tuning[]>(
        presetTunings ? presetTunings : [],
    );
    const [titleText, setTitleText] = useState("New Tuning");
    const [buttonText, setButtonText] = useState("Submit");
    const { message, messageType, showMessage, show, closeMessage } =
        useMessage();

    useEffect(() => {
        if (isEdit && editTuning) {
            setStrings(editTuning.strings);
            setName(editTuning.name);
            setType(editTuning.type);
            setStringCount(editTuning.strings.length);
            setTitleText(`Editing ${editTuning.name}`);
            setButtonText("Save Changes");
            setTunings(presetTunings ? presetTunings : []);
        } else {
            resetFields();
        }
    }, [isEdit]);

    const resetFields = () => {
        setStrings(INST_PRESETS[0].tuning.strings.slice(0, 6));
        setName("");
        setType("guitar");
        setStringCount(6);
        setTitleText("New Tuning");
        setButtonText("Submit");
        setTunings(presetTunings ? presetTunings : []);
    };

    const handleNoteChange = (index: number, note: string | number) => {
        note = typeof note === "number" ? note.toString() : note;
        const newStrings = [...strings];
        newStrings[index] = { note, noteValue: notes.indexOf(note) };
        setStrings(newStrings);
    };

    const handleSubmit = () => {
        if (name === "") {
            showMessage("Name is required!", "error");
        } else {
            const submittedTuning: Tuning = {
                name,
                strings,
                type,
            };
            if (isEdit && editTuning) {
                submittedTuning.id = editTuning.id;
                onEdit(submittedTuning, submittedTuning);
            } else {
                onSubmit(submittedTuning);
            }
            onClose();
            resetFields();
        }
    };

    const handleStringCountChange = (
        count: number | string,
        newType: InstType,
    ) => {
        if (!isEdit) {
            const numCount =
                typeof count === "number" ? count : parseInt(count);
            const newStrings = INST_PRESETS.find(
                (preset) =>
                    preset.instrument === newType &&
                    preset.forStrings.includes(numCount),
            )?.tuning.strings.slice(0, numCount);
            if (newStrings) {
                setTranspose({ prev: 0, current: 0 });
                setStrings(newStrings);
                setStringCount(numCount);
            }
        }
    };

    const handleTypeChange = (newType: InstType) => {
        if (!isEdit) {
            setType(newType);
            handleStringCountChange(DEFAULT_STRING_COUNT[newType], newType);
        }
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTuning = tunings.find((t) => t.id === e.target.value);
        if (selectedTuning) {
            setStrings(selectedTuning.strings);
            setType(selectedTuning.type);
            setStringCount(selectedTuning.strings.length);
            setName(selectedTuning.name);
            setTranspose({ prev: 0, current: 0 });
        }
    };

    const handleTranspose = (trans: number | string) => {
        trans = typeof trans === "number" ? trans : parseInt(trans);
        const prev = transpose.current;
        setTranspose({ prev: prev, current: trans });
        const step = trans - prev;
        const newStrings = strings.map((str) => {
            const newNoteValue = str.noteValue + step;
            const newNoteIndex =
                newNoteValue >= 0 && newNoteValue < notes.length
                    ? newNoteValue
                    : str.noteValue;
            return { note: notes[newNoteIndex], noteValue: newNoteIndex };
        });
        setStrings(newStrings);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="sm:max-w-md max-w-xs mx-auto px-8 pb-6">
                {/*Title*/}
                <h2 className="text-2xl font-bold mb-6">{titleText}</h2>
                {/* Desktop Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-4">
                    {/* Column 1: String Notes */}
                    <div className="sm:order-1 order-2">
                        <label className="block text-sm font-medium mb-2">
                            Strings
                        </label>
                        <div className="grid gap-2 mb-6 sm:mb-0 place-items-center">
                            {strings.map((str, index) => (
                                <div
                                    key={index + str.note}
                                    className="col-span-1  sm:w-full w-3/5"
                                >
                                    <ArrowSelector
                                        key={str.noteValue}
                                        options={notes}
                                        value={str.note}
                                        onChange={(note) =>
                                            handleNoteChange(index, note)
                                        }
                                        errorState={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: String Count, Transpose, Instrument, Preset, Tuning Name */}
                    <div className="sm:col-span-2 sm:order-2 order-1">
                        <div className="flex justify-between">
                            {/* String Count/Transpose */}
                            <div className="mb-4 flex-grow px-2 w-full sm:w-1/2">
                                <label className="block text-sm font-medium mb-2">
                                    String Count
                                </label>
                                <ArrowSelectorNumber
                                    min={STRING_RANGE[0]}
                                    max={STRING_RANGE[1]}
                                    step={1}
                                    value={stringCount}
                                    onChange={(count) =>
                                        handleStringCountChange(count, type)
                                    }
                                    disabled={isEdit}
                                    errorState={false}
                                />
                            </div>
                            <div className="mb-4 flex-grow px-2 w-full sm:w-1/2">
                                <label className="block text-sm font-medium mb-2">
                                    Transpose
                                </label>
                                <ArrowSelectorNumber
                                    min={-MAX_TRANSPOSE}
                                    max={MAX_TRANSPOSE}
                                    step={1}
                                    value={transpose.current}
                                    onChange={(value) => handleTranspose(value)}
                                    errorState={false}
                                />
                            </div>
                        </div>

                        <div className="">
                            {/*Instrument Type*/}
                            <div className="mb-4 flex flex-col justify-center">
                                <label className="block text-sm font-medium">
                                    Instrument
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => {
                                        handleTypeChange(
                                            e.target.value as InstType,
                                        );
                                    }}
                                    className="mt-2 mx-2 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                                    disabled={isEdit}
                                >
                                    <option value="guitar">Guitar</option>
                                    <option value="bass">Bass</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {/*Preset*/}
                            <div className="mb-4 flex flex-col justify-center">
                                <label className="block text-sm font-medium">
                                    Preset
                                </label>
                                <select
                                    onChange={handlePresetChange}
                                    disabled={
                                        !presetTunings ||
                                        presetTunings.length === 0
                                    }
                                    className="mt-1 mx-2 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                                >
                                    {isEdit && editTuning
                                        ? tunings
                                              .filter(
                                                  (tuning) =>
                                                      tuning.type ===
                                                          editTuning.type &&
                                                      tuning.strings.length ===
                                                          editTuning.strings
                                                              .length,
                                              )
                                              .map((t) => (
                                                  <option
                                                      key={t.id}
                                                      value={t.id}
                                                  >
                                                      {capitalize(t.type)}:{" "}
                                                      {t.name}
                                                  </option>
                                              ))
                                        : tunings.map((t) => (
                                              <option key={t.id} value={t.id}>
                                                  {capitalize(t.type)}: {t.name}
                                              </option>
                                          ))}
                                </select>
                            </div>
                            {/*Name*/}
                            <div className="mb-8 flex flex-col justify-center">
                                <label className="block text-sm font-medium">
                                    Tuning Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tuning Name"
                                    className="mx-2 mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                                />
                            </div>
                            {/*Submit*/}
                            <button
                                onClick={handleSubmit}
                                className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2 hidden sm:flex justify-self-center justify-center w-3/4"
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                    <div className="order-3 flex">
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 flex sm:hidden justify-self-center justify-center w-full"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2 flex sm:hidden justify-self-center justify-center w-full"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
                <Alert
                    show={show}
                    message={message}
                    type={messageType}
                    onClose={closeMessage}
                    style="mt-4"
                />
            </div>
        </Modal>
    );
};

export default TuningInput;
