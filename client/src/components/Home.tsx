import React, {useEffect, useState} from 'react';
import TuningConfirm from "./TuningConfirm.tsx";
import TuningInput from "./TuningInput.tsx";
import InstrumentInput from "./InstrumentInput.tsx";
import {defaultTensions, defaultTunings, notes, serverURL, stringRange, stringTypeFactors} from "../defaults.ts";
import {Instrument, StringSet, Tuning, UserData} from "../../../types.ts";
import {getUnitWeight, stringAverage, stringGauge} from "../utils/calculate.ts";
import AverageStringSet from "./AverageStringSet.tsx";
import axios, {AxiosError} from "axios";
import {addInstrument, deleteInstrument, updateInstrument, updateUser} from "../utils/serverFunctions.ts";

interface HomeProps {
    instruments: Instrument[];
    tunings: Tuning[];
    isLoading: boolean;
    onUpdateInst: () => void;
    userData: UserData;
}

const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

const HomePage: React.FC<HomeProps> = ({instruments, tunings, isLoading, onUpdateInst, userData}) => {

    // const [currentTunings, setCurrentTunings] = useState<Tuning[]>(tunings);
    // const [currentInstruments, setCurrentInstruments] = useState<Instrument[]>(instruments);
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

    if (isLoading || !instruments.length || !tunings.length || userData === undefined){
        return <div>Loading...</div>
    }

    const onUpdateInstrument = async (changes: object, instID?: string) => {
        updateInstrument(changes, instID).then(() => {
            onUpdateInst();
            setMessageClass('text-blue-400');
            setMessage('Instrument updated successfully!');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }).catch((e) => {
            console.error(e);
            setMessageClass('text-red-400');
            setMessage('Could not update instrument');
            setTimeout(() => {
                setMessage('');
            }, 3000)
        });
    };

    const onAddInstrument = async (newInst: Instrument) => {
        const instrument = {...newInst, tunings: newInst.tunings.map((tuning: Tuning) => tuning.id)};
        addInstrument(instrument)
            .then((instID) => updateUser({instruments: [...userData.instruments, instID]}, userData.id))
            .then(() => {
                onUpdateInst();
                setMessageClass('text-blue-400');
                setMessage('Instrument added successfully!');
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            }).catch((e) => {
                console.error(e);
                setMessageClass('text-red-400');
                setMessage('Could not add instrument');
                setTimeout(() => {
                    setMessage('');
                }, 3000)
        })
    };


    const onUpdateTuning = async (changes: object, tuningID?: string) => {
        try {
            const response = await axios.patch(`${serverURL}/tunings/${tuningID}`, changes);
            if (response.data.status === 200) {
                setMessageClass('text-blue-400');
                setMessage('Tuning updated successfully!');
            }
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                setMessageClass('text-red-400');
                setMessage('Could not update tuning');
            }
        }
    };

    const onAddTuning = async (tuning: object) => {
        try {
            const response = await axios.post(`${serverURL}/tunings/`, tuning);
            if (response.data.status === 201) {
                setMessageClass('text-blue-400');
                setMessage('Tuning updated successfully!');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setMessageClass('text-red-400');
                setMessage('Could not add tuning');
            }
        }
    }

    const handleOpenGetAv = () => {
        if (selectedInstrument.tunings.length){
            setIsTuningConfirmOpen(true);
        } else {
            setMessageClass('text-red-400');
            setMessage('Instrument has no tunings!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
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
        const inst = {...newInst, tunings: newInst.tunings.map((tuning: Tuning) => tuning.id)};
        onAddInstrument(inst).then((response) => {
            console.log(response);
            onUpdateInst();
        }).catch((error: AxiosError) => {
            console.log(error);
        })
    };

    const handleOpenStringSet = () => {
        setIsStringSetOpen(true);
    };
    const handleCloseStringSet = () => {
        setIsStringSetOpen(false);
    };
    const handleSubmitStringSet = (newStringSet: StringSet) => {
        onUpdateInstrument({stringSets: [...selectedInstrument.stringSets, newStringSet]}).then().catch((error: AxiosError) => {console.log(error)})
    };

    const handleEditInst = () => {
        setIsEdit(true);
        setIsInstInputOpen(true);
    };

    const handleEditTuning = () => {
        setIsEdit(true);
        setIsTuningInputOpen(true);
    };

    const handleDeleteInst = (instID: string) => {
        const updatedInstruments = instruments
            .filter((inst: Instrument) => inst.id !== instID)
            .map((inst: Instrument) => inst.id);
        deleteInstrument(instID)
            .then(() => updateUser({instruments: updatedInstruments}, userData.id))
            .then(() => onUpdateInst())
            .catch((e) => console.error(e));
    };

    const handleDeleteTuning = () => {
        console.log("Tuning Deleted, to be implemented");
    };

    const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const instrumentID = event.target.value;
        const instrument = instruments.find(i => i.id === instrumentID);
        if (instrument) {
            setSelectedInstrument(instrument);
            if (instrument.tunings.length) {
                setSelectedTuning(instrument.tunings[0]);
            }
        }
    };

    const handleTuningChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tuningID = event.target.value;
        const tuning = tunings.find(t => t.id === tuningID);
        if (tuning) {
            setSelectedTuning(tuning);
        }
    };

    const handleAddTuningToInstrument = async () => {
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
        const newTuningIDs = [...selectedInstrument.tunings, selectedTuning].map((tuning) => tuning.id);
        const updatedInstrument = {
            ...selectedInstrument,
            tunings: [...selectedInstrument.tunings, selectedTuning]
        };
        onUpdateInstrument({tunings: newTuningIDs}, selectedInstrument.id).then((response) => {
            console.log(response);

        }).catch((error: AxiosError) => {
            console.log(error);
        })


    };

    return (
        <div className="flex flex-col p-6">
            <div className="">
                <h1 className="text-2xl font-bold mb-4">{userData.username}</h1>

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
                onSubmit={onAddInstrument}
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