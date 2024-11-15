import React, { useState } from 'react';
import TuningConfirm from "./TuningConfirm.tsx";
import TuningInput from "./TuningInput.tsx";
import InstrumentInput from "./InstrumentInput.tsx";
import {defaultTensions, defaultTunings, notes, stringRange, stringTypeFactors} from "../defaults.ts";
import {Instrument, StringSet, Tuning} from "../../../types.ts";
import {getUnitWeight, stringAverage, stringGauge} from "../utils/calculate.ts";
import AverageStringSet from "./AverageStringSet.tsx";

// const instruments: Instrument[] = [
//     {
//         id: '0',
//         name: 'Stratocaster',
//         strings: 6,
//         tunings: [
//             {
//                 id: '0',
//                 name: 'E Standard',
//                 strings: [
//                     { note: 'E4', noteValue: 52 },
//                     { note: 'B3', noteValue: 47 },
//                     { note: 'G3', noteValue: 43 },
//                     { note: 'D3', noteValue: 38 },
//                     { note: 'A2', noteValue: 33 },
//                     { note: 'E2', noteValue: 28 },
//                 ],
//                 type: 'guitar',
//             },
//             {
//                 id: '2',
//                 name: 'DADGAD',
//                 strings: [
//                     { note: 'D4', noteValue: 50 },
//                     { note: 'A3', noteValue: 45 },
//                     { note: 'G3', noteValue: 43 },
//                     { note: 'D3', noteValue: 38 },
//                     { note: 'A2', noteValue: 33 },
//                     { note: 'D2', noteValue: 26 },
//                 ],
//                 type: 'guitar',
//             },
//         ],
//         scale: 25.5,
//         targetTension: [16.2, 15.4, 16.6, 18.4, 19, 16.9],
//         type: 'guitar',
//         stringSets: [
//             { id: '0', name: '10-46', gauges: [10, 13, 17, 26, 36, 46], woundStrings: [false, false, false, true, true, true] },
//         ]
//     },
//     {
//         id: '1',
//         name: 'P Bass',
//         strings: 4,
//         tunings: [
//             {
//                 id: '5',
//                 name: 'E Standard',
//                 strings: [
//                     { note: 'G2', noteValue: 31 },
//                     { note: 'D2', noteValue: 26 },
//                     { note: 'A1', noteValue: 21 },
//                     { note: 'E1', noteValue: 16 },
//                 ],
//                 type: 'bass',
//             },
//         ],
//         scale: 34,
//         targetTension: [42.5, 48.4, 40.1, 34.7],
//         type: 'bass',
//         stringSets: [
//             { id: '1', name: '45-100', gauges: [45, 65, 80, 100], woundStrings: [true, true, true, true] },
//         ]
//     }
// ];

interface HomeProps {
    instruments: Instrument[];
    tunings: Tuning[];
}

const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

const HomePage: React.FC<HomeProps> = ({instruments, tunings}) => {
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instruments[0]);
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(instruments[0].tunings[0]);
    const [message, setMessage] = useState<string>('');
    const [messageClass, setMessageClass] = useState<string>('text-blue-400');
    const [isTuningConfirmOpen, setIsTuningConfirmOpen] = useState(false);
    const [isTuningInputOpen, setIsTuningInputOpen] = useState(false);
    const [isInstInputOpen, setIsInstInputOpen] = useState(false);
    const [isStringSetOpen, setIsStringSetOpen] = useState(false);
    const [avStringSet, setAvStringSet] = useState<StringSet>(instruments[0].stringSets[0]);
    const [averageTuning, setAverageTuning] = useState<number[]>([]);
    const [unitWeights, setUnitWeights] = useState<number[]>([]);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleOpenGetAv = () => {
        setIsTuningConfirmOpen(true);
    };
    const handleCloseGetAv = () => {
        setIsTuningConfirmOpen(false);
    };
    const handleSubmitGetAv = (selectedTuningNames: string[], wound3rd: boolean) => {
        const selectedTunings: Tuning[] = selectedInstrument.tunings.filter((tuning) => selectedTuningNames.includes(tuning.name));
        // const inst: Instrument = {
        //     ...selectedInstrument,
        //     tunings: selectedTunings,
        // };
        const avTuning = stringAverage(selectedTunings);
        console.log(avTuning)
        if (avTuning) {
            setAverageTuning(avTuning);
            const stringSet: StringSet = {
                gauges: [],
                woundStrings: [],
                name: ''
            };
            const UWs: number[] = [];
            avTuning.forEach((note: number, index) => {
                UWs[index] = getUnitWeight(note, selectedInstrument.scale, selectedInstrument.targetTension[index]);
                let wound = true;
                // Not ideal; should handle more wound vs. plain scenarios
                if (selectedInstrument.type === 'guitar') {
                    if (index < 2 || (!wound3rd && index === 2)) {
                        wound = false
                    }
                }
                const coeff = stringTypeFactors[selectedInstrument.type][wound? 'wound' : 'plain'].coeff;
                const power = stringTypeFactors[selectedInstrument.type][wound? 'wound' : 'plain'].power;

                stringSet.gauges.push(stringGauge(UWs[index], coeff, power));
                stringSet.woundStrings.push(wound);
            });
            setUnitWeights(UWs);
            console.log(stringSet)
            setAvStringSet(stringSet);
        }
        setIsStringSetOpen(true);
    };

    const handleOpenTuningInput = () => {
        setIsTuningInputOpen(true);
    };
    const handleCloseTuningInput = () => {
        setIsTuningInputOpen(false);
    };
    const handleSubmitTuningInput = (newTuning: Tuning) => {
        console.log("Tuning Added: ", newTuning);
    };

    const handleOpenInstInput = () => {
        setIsInstInputOpen(true);
    };
    const handleCloseInstInput = () => {
        setIsInstInputOpen(false);
    };
    const handleSubmitInstInput = (newInst: Instrument) => {
        console.log("New Instrument Added: ", newInst);
    };

    const handleOpenStringSet = () => {
        setIsStringSetOpen(true);
    };
    const handleCloseStringSet = () => {
        setIsStringSetOpen(false);
    };
    const handleSubmitStringSet = (newStringSet: StringSet) => {
        console.log("New String Set Added: ", newStringSet);
    };

    const handleEditInst = () => {
        setIsEdit(true);
        setIsInstInputOpen(true);
    };

    const handleEditTuning = () => {
        setIsEdit(true);
        setIsTuningInputOpen(true);
    };

    const handleDeleteInst = () => {
        console.log("Instrument Deleted, to be implemented");
    };

    const handleDeleteTuning = () => {
        console.log("Tuning Deleted, to be implemented");
    };

    const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const instrumentID = event.target.value;
        const instrument = instruments.find(i => i.id === instrumentID);
        if (instrument) {
            setSelectedInstrument(instrument);
            setSelectedTuning(instrument.tunings[0]);
        }
    };

    const handleTuningChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tuningID = event.target.value;
        const tuning = tunings.find(t => t.id === tuningID);
        if (tuning) {
            setSelectedTuning(tuning);
        }
    };

    const handleAddTuningToInstrument = () => {
        if (selectedInstrument.tunings.some(tuning => tuning.name === selectedTuning.name)) {
            setMessageClass('text-red-500');
            setMessage('Instrument already has this tuning!');
            return;
        }
        if (selectedInstrument.type !== selectedTuning.type || selectedInstrument.strings !== selectedTuning.strings.length) {
            setMessageClass('text-red-500');
            setMessage('Tuning does not match instrument\'s type or string count.');
            return;
        }
        const updatedInstrument = {
            ...selectedInstrument,
            tunings: [...selectedInstrument.tunings, selectedTuning]
        };

        setSelectedInstrument(updatedInstrument);
        instruments[instruments.findIndex(i => i.name === selectedInstrument.name)] = updatedInstrument;
        setMessageClass('text-blue-400');
        setMessage('Tuning added successfully!');
    };

    return (
        <div className="flex flex-col p-6">
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Tuning Averager</h1>

                {/*Instruments*/}
                <div className="mb-7">
                    <label htmlFor="instrument-select" className="block text-xl font-semibold">
                        Instruments
                    </label>
                    <select
                        id="instrument-select"
                        value={selectedInstrument.id}
                        onChange={handleInstrumentChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {instruments.map((instrument, index) => (
                            <option key={index} value={instrument.id}>
                                {instrument.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex-grow space-3">
                        <p className="text-lg font-medium">{selectedInstrument.name}</p>
                        <button
                            className="bg-gray-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                            onClick={handleEditInst}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                            onClick={handleDeleteInst}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="justify-items-start">
                        <p><strong>Type: </strong>{capitalize(selectedInstrument.type)}</p>
                        <p><strong>Scale Length: </strong>{selectedInstrument.scale}"</p>
                        <p><strong>Target
                            Tensions: </strong>{selectedInstrument.targetTension.slice(0, -1).map((tension, index) => (
                            <span key={index}>{tension} | </span>
                        ))}
                            <span>{selectedInstrument.targetTension[selectedInstrument.targetTension.length - 1]}</span>
                        </p>
                        <label><b>Tunings:</b></label>
                        <ul className="mb-3 justify-items-start">
                            {selectedInstrument.tunings.map((tuning, index) => (
                                <li className="cursor-pointer" onClick={() => setSelectedTuning(tuning)}
                                    key={index}>{tuning.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-grow space-4">
                        <button
                            className="bg-blue-600 text-white m-2 px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2"
                            onClick={handleOpenInstInput}
                        >
                            New Instrument
                        </button>
                        <button
                            className="bg-indigo-600 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2"
                            onClick={handleOpenGetAv}
                        >
                            Get Av. String Set
                        </button>
                    </div>
                </div>

                {/*Tunings*/}
                <div className="mb-2">
                    <label htmlFor="tuning-select" className="block text-xl font-semibold">
                        Tunings
                    </label>
                    <select
                        id="tuning-select"
                        value={selectedTuning.id}
                        onChange={handleTuningChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {tunings.map((tuning, index) => (
                            <option key={index} value={tuning.id}>
                                {capitalize(tuning.type)}: {tuning.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex-grow space-3">
                        <p className="text-lg font-medium">{selectedTuning.name}</p>
                        <button
                            className="bg-gray-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                            onClick={handleEditTuning}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                            onClick={handleDeleteTuning}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="justify-items-start">
                        <p><strong>Type: </strong>{capitalize(selectedTuning.type)}</p>
                        <ul className="mb-3">
                            {selectedTuning.strings.map((string, index) => (
                                <li key={index}><strong>{index + 1}: </strong>{string.note}</li>
                            ))}
                        </ul>
                    </div>


                    <div className="flex-grow space-4">
                        <button
                            className="bg-blue-600 text-white m-2 px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2"
                            onClick={handleOpenTuningInput}
                        >
                            New Tuning
                        </button>
                        <button
                            className="bg-indigo-600 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2"
                            onClick={handleAddTuningToInstrument}
                        >
                            Add to Current Inst.
                        </button>
                    </div>
                </div>

                {message && <p className={messageClass}>{message}</p>}


            </div>
            <TuningConfirm
                isOpen={isTuningConfirmOpen}
                onClose={handleCloseGetAv}
                onSubmit={handleSubmitGetAv}
                tunings={selectedInstrument.tunings}
                instrument={selectedInstrument.name}
                defaultChecked={Array(selectedInstrument.tunings.length).fill(true)}
            />
            <TuningInput
                notes={notes}
                presetTunings={tunings}
                defaultTunings={defaultTunings}
                onSubmit={handleSubmitTuningInput}
                isOpen={isTuningInputOpen}
                onClose={handleCloseTuningInput}
            />
            <InstrumentInput
                onSubmit={handleSubmitInstInput}
                tunings={tunings}
                targetTensions={defaultTensions}
                stringRange={stringRange}
                isOpen={isInstInputOpen}
                onClose={handleCloseInstInput}
            />
            <AverageStringSet
                stringSet={avStringSet}
                isOpen={isStringSetOpen}
                onClose={handleCloseStringSet}
                onSubmit={handleSubmitStringSet}
                averageTuning={averageTuning}
                instrument={selectedInstrument}
                unitWeights={unitWeights}
            />

        </div>
    );
};

export default HomePage;