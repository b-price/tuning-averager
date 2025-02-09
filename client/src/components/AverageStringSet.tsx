import { Instrument, StringSet, Note } from "../../types.ts";
import React, { useEffect, useState } from "react";
import Modal from "./Modal.tsx";
import {
    coeffPower,
    convertToNote,
    formatMaterial,
    tension,
    uwFromGauge,
} from "../utils/calculate.ts";
import {
    NOTES,
    WOUND_CHAR,
    PLAIN_CHAR,
    REFERENCE_PITCH,
    MIN_TAPER_GAUGE,
    LONG_THIN_GAUGE,
    GUITAR_WARNING_SCALE,
    TAPER_WARNING,
    LENGTH_WARNING,
    DEFAULT_SCALES,
    STRING_MATERIAL_FACTORS,
    DEFAULT_STRING_MATERIAL,
    DEFAULT_INST, MIN_STRING_GAUGE, MAX_STRING_GAUGE, PRECISE_GAUGE, MAX_DISPLAY_TENSION,
} from "../defaults.ts";
import ArrowSelector from "./ArrowSelector.tsx";
import { useMessage } from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";
import ArrowSelectorNumber from "./ArrowSelectorNumber.tsx";

interface AverageStringSetProps {
    stringSet: StringSet;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newStringSet: StringSet) => void;
    instrument: Instrument;
    isEdit: boolean;
    editStringSet: (stringSet: StringSet) => void;
    referencePitch: number;
}

const AverageStringSet: React.FC<AverageStringSetProps> = ({
    stringSet,
    isOpen,
    onClose,
    onSubmit,
    instrument = DEFAULT_INST,
    isEdit,
    editStringSet,
    referencePitch = REFERENCE_PITCH,
}) => {
    const [newGauges, setNewGauges] = useState<number[]>([]);
    const [woundStrings, setWoundStrings] = useState<boolean[]>([]);
    const [name, setName] = useState<string>("");
    const [tensions, setTensions] = useState<number[]>([]);
    const [noteObjects, setNoteObjects] = useState<Note[]>([]);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [stringMaterial, setStringMaterial] = useState<string>(
        stringSet.stringMaterial || DEFAULT_STRING_MATERIAL[instrument.type],
    );
    const [errorState, setErrorState] = useState({
        cents: Array.from({ length: stringSet.gauges.length }, () => false),
        gauge: Array.from({ length: stringSet.gauges.length }, () => false),
    });
    const { message, messageType, showMessage, show, closeMessage } =
        useMessage();

    useEffect(() => {
        if (isOpen) {
            resetToAverageTuning();
        }
    }, [isOpen, stringSet]);

    useEffect(() => {
        const taperWarnings: number[] = [];
        const lengthWarnings: number[] = [];
        newGauges.forEach((gauge) => {
            if (
                gauge >= MIN_TAPER_GAUGE &&
                instrument.scale < DEFAULT_SCALES.bass
            ) {
                taperWarnings.push(gauge);
            }
            if (
                gauge < LONG_THIN_GAUGE &&
                instrument.scale >= GUITAR_WARNING_SCALE
            ) {
                lengthWarnings.push(gauge);
            }
        });
        if (taperWarnings.length || lengthWarnings.length) {
            const taperWarningString = taperWarnings.length
                ? `Gauge${taperWarnings.length > 1 ? "s" : ""} ${taperWarnings.join(", ")} ${taperWarnings.length < 1 ? "are" : "is"} ${TAPER_WARNING}`
                : ``;
            const lengthWarningString = lengthWarnings.length
                ? `Gauge${lengthWarnings.length > 1 ? "s" : ""} ${lengthWarnings.join(", ")} ${LENGTH_WARNING} ${instrument.scale}".`
                : ``;
            showMessage(
                taperWarningString + lengthWarningString,
                "warning",
                Infinity,
            );
        } else {
            closeMessage();
        }
    }, [newGauges]);

    const resetToAverageTuning = () => {
        setNewGauges(stringSet.gauges);
        setWoundStrings(stringSet.woundStrings);
        setTensions(stringSet.tensions);
        setNoteObjects(
            stringSet.noteValues.map((noteValue) => convertToNote(noteValue)),
        );
        setName(stringSet.name);
        setFavorite(stringSet.favorite || false);
        setStringMaterial(
            stringSet.stringMaterial ||
                DEFAULT_STRING_MATERIAL[instrument.type],
        );
    };

    const handleStringGaugeChange = (stringIndex: number, gauge: number) => {
        setNewGauges((prevSet) => {
            const newSet = [...prevSet];
            newSet[stringIndex] = gauge;
            return newSet;
        });
        adjustTension(
            stringIndex,
            gauge,
            noteObjects[stringIndex].noteValue,
            stringMaterial,
        );
        const newGaugeErrors = [...errorState.gauge];
        newGaugeErrors[stringIndex] = gauge < MIN_STRING_GAUGE || gauge > MAX_STRING_GAUGE;
        setErrorState({...errorState, gauge: newGaugeErrors});
    };

    const handleCentsChange = (stringIndex: number, cents: number) => {
        if (!isNaN(cents) && cents >= 0 && cents < 100) {
            const noteValue =
                Math.floor(noteObjects[stringIndex].noteValue) + cents / 100;
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
            adjustTension(
                stringIndex,
                newGauges[stringIndex],
                noteValue,
                stringMaterial,
            );
        }

        const newCentsErrors = [...errorState.cents];
        newCentsErrors[stringIndex] = cents < 0 || cents > 99;
        setErrorState({...errorState, cents: newCentsErrors});
    };

    const adjustTension = (
        stringIndex: number,
        gauge: number,
        noteValue: number,
        strMaterial: string,
        wound?: boolean,
    ) => {
        if (instrument) {
            const woundState =
                typeof wound === "boolean" ? wound : woundStrings[stringIndex];
            const material = coeffPower(strMaterial, woundState);
            setTensions((prevTensions) => {
                const newTensions = [...prevTensions];
                const newTension = tension(
                    uwFromGauge(
                        gauge,
                        material.coeff,
                        material.power,
                    ),
                    noteValue,
                    instrument.scale,
                    referencePitch,
                );
                newTensions[stringIndex] = newTension < MAX_DISPLAY_TENSION ? newTension : MAX_DISPLAY_TENSION;
                return newTensions;
            });
        }
    };

    const handleNotesChange = (stringIndex: number, note: string | number) => {
        note = typeof note === "number" ? note.toString() : note;
        const newNote = {
            note: note,
            cents: 0,
            noteValue: NOTES.indexOf(note),
        };
        setNoteObjects((prevNotes) => {
            const newNotes = [...prevNotes];
            newNotes[stringIndex] = newNote;
            return newNotes;
        });
        adjustTension(
            stringIndex,
            newGauges[stringIndex],
            newNote.noteValue,
            stringMaterial,
        );
    };

    const toggleWoundString = (stringIndex: number) => {
        const wound = !woundStrings[stringIndex];
        setWoundStrings((prevWoundStrings) => {
            const newWoundStrings = [...prevWoundStrings];
            newWoundStrings[stringIndex] = wound;
            return newWoundStrings;
        });
        adjustTension(
            stringIndex,
            newGauges[stringIndex],
            noteObjects[stringIndex].noteValue,
            stringMaterial,
            wound,
        );
    };

    const handleMaterialChange = (material: string) => {
        setStringMaterial(material);
        newGauges.forEach((gauge, index) => {
            adjustTension(
                index,
                gauge,
                noteObjects[index].noteValue,
                material,
                woundStrings[index],
            );
        });
    };

    const handleSubmit = () => {
        if (name && name !== "") {
            const newStringSet: StringSet = {
                id: isEdit ? stringSet.id : Math.random().toString(36),
                name: name,
                gauges: newGauges,
                woundStrings: woundStrings,
                tensions: tensions,
                noteValues: stringSet.noteValues,
                favorite: favorite,
                stringMaterial: stringMaterial,
            };
            if (isEdit) {
                editStringSet(newStringSet);
            } else {
                onSubmit(newStringSet);
            }
            onClose();
        } else {
            showMessage("String Set name is required.", "error");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col mx-auto sm:px-8 px-4 pb-6 rounded-xl md:max-w-xl">
                <h2 className="text-2xl font-bold mb-2 mt-0">
                    {isEdit ? "Editing " : "Ideal "}String Set
                </h2>
                {instrument ? (
                    <h3 className="text-md font-semibold mb-4">
                        for {instrument.name}
                    </h3>
                ) : (
                    <></>
                )}

                {/* String Set Name / Material / Favorite */}
                <div className="flex flex-wrap items-center justify-evenly gap-2 mb-4">
                    <div className="justify-items-center">
                        <label className="block text-sm font-medium">
                            String Set Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                        />
                    </div>
                    <div className="justify-items-center">
                        <label className="block text-sm font-medium">
                            Favorite
                        </label>
                        <button
                            onClick={() => setFavorite(!favorite)}
                            className="text-2xl font-bold x-button py-1 px-3 focus:outline-none"
                        >
                            {favorite ? "★" : "☆"}
                        </button>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium">
                            String Material
                        </label>
                        <select
                            onChange={(e) =>
                                handleMaterialChange(e.target.value)
                            }
                            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm modalText"
                            value={stringMaterial}
                        >
                            {Object.keys(STRING_MATERIAL_FACTORS)
                                .filter(
                                    (sm) =>
                                        sm.includes(instrument.type) ||
                                        sm === "Kalium",
                                )
                                .map((str, index) => (
                                    <option key={index} value={str}>
                                        {formatMaterial(str)}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* String Set Values */}
                <div className="grid grid-cols-4 gap-y-0 gap-x-4 mb-1">
                    <div className="col-span-2 flex justify-center">
                        <label className="block text-sm font-medium">
                            Average Note
                        </label>
                    </div>

                    <label className="block text-sm font-medium">Gauge</label>
                    <label className="block text-sm font-medium">Tension</label>

                    {newGauges.map((gauge, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-subgrid col-span-4 items-center"
                        >
                            <div className="flex items-center col-span-2">
                                <label className="block text-sm font-semibold mr-2">
                                    {index + 1}:
                                </label>
                                <div className="w-3/4 scale-90">
                                    <ArrowSelector
                                        key={index + noteObjects[index].note}
                                        options={NOTES}
                                        value={noteObjects[index].note}
                                        onChange={(note) =>
                                            handleNotesChange(index, note)
                                        }
                                        errorState={false}
                                    />
                                </div>
                                <p>+</p>
                                <div className="w-3/4 scale-90">
                                    <ArrowSelectorNumber
                                        key={index + 'C'}
                                        min={0}
                                        max={99}
                                        step={10}
                                        value={noteObjects[index].cents}
                                        onChange={(val) =>
                                            handleCentsChange(index, val)
                                        }
                                        errorState={errorState.cents[index]}
                                        input
                                    />
                                </div>
                                <p>¢</p>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="sm:w-3/4 scale-90">
                                    <ArrowSelectorNumber
                                        key={index + gauge}
                                        min={MIN_STRING_GAUGE}
                                        max={MAX_STRING_GAUGE}
                                        step={gauge < PRECISE_GAUGE ? 0.5 : 1}
                                        value={gauge}
                                        onChange={(newGauge) =>
                                            handleStringGaugeChange(
                                                index,
                                                newGauge,
                                            )
                                        }
                                        errorState={errorState.gauge[index]}
                                    />
                                </div>

                                {/* Toggle wound/plain */}
                                <p
                                    className="font-semibold ml-0 cursor-pointer hover:text-indigo-400"
                                    onClick={() => toggleWoundString(index)}
                                >
                                    {woundStrings[index]
                                        ? WOUND_CHAR
                                        : PLAIN_CHAR}
                                </p>
                            </div>

                            <p className="">
                                <strong>{tensions[index].toFixed(2)}</strong>{" "}
                                lbs.
                            </p>
                        </div>
                    ))}
                </div>

                {/*Total Tension*/}
                <div className="flex items-center justify-center mb-4">
                    <label className="mr-2">Total Tension:</label>
                    <p>
                        <strong>
                            {tensions.reduce((a, b) => a + b, 0).toFixed(2)}
                        </strong>{" "}
                        lbs.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-center items-center flex-wrap md:flex-nowrap gap-x-4">
                    <button
                        className="bg-gray-500 text-white m-1 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                        onClick={resetToAverageTuning}
                    >
                        <span className="hidden md:block">
                            Reset to Average Tuning
                        </span>
                        <span className="block md:hidden">Reset</span>
                    </button>

                    <button
                        className="bg-gray-500 text-white m-1 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 block md:hidden"
                        onClick={onClose}
                    >
                        Close
                    </button>

                    <button
                        className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                        onClick={handleSubmit}
                    >
                        <span className="hidden md:block">
                            {isEdit
                                ? "Edit String Set"
                                : "Add String Set to Instrument"}
                        </span>
                        <span className="block md:hidden">
                            {isEdit ? "Edit String Set" : "Add Set to Instrument"}
                        </span>
                    </button>
                </div>
                <Alert
                    show={show}
                    message={message}
                    type={messageType}
                    onClose={closeMessage}
                    fixed={false}
                />
            </div>
        </Modal>
    );
};

export default AverageStringSet;
