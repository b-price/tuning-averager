import React, { useEffect, useState } from "react";
import ArrowSelector from "./ArrowSelector.tsx";
import { GuitarString, Tuning, Transpose, InstType } from "../../types.ts";
import Modal from "./Modal.tsx";
import { capitalize } from "../utils/calculate.ts";
import {
    DEFAULT_STRING_COUNT,
    INST_PRESETS,
    VALID_STRINGS,
} from "../defaults.ts";

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Column 1: String Notes */}
                    <div>
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
                                        initialValue={str.note}
                                        onChange={(note) =>
                                            handleNoteChange(index, note)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: String Count, Transpose, Instrument, Preset, Tuning Name */}
                    <div className="sm:col-span-2">
                        <div className="flex justify-between">
                            {/* String Count/Transpose */}
                            <div className="mb-4 flex-grow px-2 w-full sm:w-1/2">
                                <label className="block text-sm font-medium mb-2">
                                    String Count
                                </label>
                                <ArrowSelector
                                    key={stringCount + "S"}
                                    options={VALID_STRINGS}
                                    initialValue={stringCount}
                                    onChange={(count) =>
                                        handleStringCountChange(count, type)
                                    }
                                    disabled={isEdit}
                                />
                            </div>
                            <div className="mb-4 flex-grow px-2 w-full sm:w-1/2">
                                <label className="block text-sm font-medium mb-2">
                                    Transpose
                                </label>
                                <ArrowSelector
                                    key={transpose.current + "T"}
                                    options={[...Array(25).keys()].map(
                                        (i) => i - 12,
                                    )}
                                    initialValue={transpose.current}
                                    onChange={(value) => handleTranspose(value)}
                                />
                            </div>
                        </div>
                        {/*Instrument Type*/}
                        <div className="mb-4">
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
                                className="mt-2 mx-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={isEdit}
                            >
                                <option value="guitar">Guitar</option>
                                <option value="bass">Bass</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/*Preset*/}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Preset
                            </label>
                            <select
                                onChange={handlePresetChange}
                                disabled={
                                    !presetTunings || presetTunings.length === 0
                                }
                                className="mt-1 mx-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {isEdit && editTuning
                                    ? tunings
                                          .filter(
                                              (tuning) =>
                                                  tuning.type ===
                                                      editTuning.type &&
                                                  tuning.strings.length ===
                                                      editTuning.strings.length,
                                          )
                                          .map((t) => (
                                              <option key={t.id} value={t.id}>
                                                  {capitalize(t.type)}: {t.name}
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
                        <div className="mb-8">
                            <label className="block text-sm font-medium">
                                Tuning Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tuning Name"
                                className="mx-2 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/*Submit*/}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TuningInput;
