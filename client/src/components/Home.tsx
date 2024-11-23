import React, {useEffect, useState} from 'react';
import TuningConfirm from "./TuningConfirm";
import TuningInput from "./TuningInput";
import InstrumentInput from "./InstrumentInput";
import {
    DECIMAL_POINTS,
    defaultTensions,
    defaultTunings,
    notes, presetInstruments,
    presetTunings,
    stringRange,
    stringTypeFactors
} from "../defaults";
import {Instrument, StringSet, Tuning, UserData} from "../../../types";
import {capitalize, getUnitWeight, round, stringAverage, stringGauge, tension, uwFromGauge} from "../utils/calculate";
import AverageStringSet from "./AverageStringSet";
import {
    addInstrument, addTuning,
    deleteInstrument, deleteTuning,
    getInstruments,
    getTunings,
    updateInstrument, updateTuning,
    updateUser
} from "../utils/serverFunctions";
import DeleteConfirm from "./DeleteConfirm.tsx";

interface HomeProps {
    userData: UserData;
}

const HomePage: React.FC<HomeProps> = ({ userData }) => {

    const [tunings, setTunings] = useState<Tuning[]>(presetTunings);
    const [instruments, setInstruments] = useState<Instrument[]>(presetInstruments);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instruments[0]);
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(instruments[0].tunings[0]);
    const [message, setMessage] = useState<string>('');
    const [messageClass, setMessageClass] = useState<string>('text-blue-400');
    const [isTuningConfirmOpen, setIsTuningConfirmOpen] = useState(false);
    const [isTuningInputOpen, setIsTuningInputOpen] = useState(false);
    const [isInstInputOpen, setIsInstInputOpen] = useState(false);
    const [isAveragerOpen, setIsAveragerOpen] = useState(false);
    const [avStringSet, setAvStringSet] = useState<StringSet>(instruments[0].stringSets[0]);
    const [averageTuning, setAverageTuning] = useState<number[]>([]);
    //const [unitWeights, setUnitWeights] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInstDeleteOpen, setIsInstDeleteOpen] = useState(false);
    const [isTuningDeleteOpen, setIsTuningDeleteOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // On mount
    useEffect(() => {
        setIsLoading(true);
        getTunings(userData)
            .then((data) => {
                if (data) {
                    setTunings(data.userTunings);
                    setSelectedTuning(data.userTunings[0]);
                }
                return getInstruments(data);
            })
            .then((insts) => {
                if (insts) {
                    setInstruments(insts);
                    setSelectedInstrument(insts[0]);
                }
            })
            .then(() => setIsLoading(false))
            .catch((e) => console.error(e));
    },[])

    if (isLoading || !instruments.length || !tunings.length || userData === undefined){
        return <div>Loading...</div>
    }

    // Instrument functions
    const onUpdateInstrument = async (changes: object, updatedInst: Instrument) => {
        updateInstrument(changes, updatedInst.id).then(() => {
            setInstruments(instruments.map((inst) => {return inst.id === updatedInst.id? updatedInst : inst}));
            setSelectedInstrument(updatedInst);
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
            .then((instID) => {
                newInst.id = instID;
                updateUser({instruments: [...userData.instruments, instID]}, userData.id);
            })
            .then(() => {
                setInstruments([...instruments, newInst]);
                setSelectedInstrument(newInst);
                if (newInst.tunings.length > 0) {
                    setSelectedTuning(newInst.tunings[0]);
                }
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

    const handleDeleteInst = (instID?: string) => {
        const updatedInstruments = instruments
            .filter((inst: Instrument) => inst.id !== instID)
        deleteInstrument(instID)
            .then(() => updateUser({instruments: updatedInstruments.map((inst: Instrument) => inst.id)}, userData.id))
            .then(() => {
                setInstruments(updatedInstruments);
                setSelectedInstrument(updatedInstruments[0]);
                if (updatedInstruments[0].tunings.length) {
                    setSelectedTuning(updatedInstruments[0].tunings[0]);
                }
                setMessageClass('text-blue-400');
                setMessage('Instrument successfully deleted');
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            })
            .catch((e) => {
                console.error(e);
                setMessageClass('text-red-400');
                setMessage('Error deleting instrument!');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            });
    };

    // Tuning functions
    const onUpdateTuning = async (changes: object, updatedTuning: Tuning) => {
        const updatedInstruments: Instrument[] = [];
        let currentInstHasTuning = false;
        let currentInst: Instrument;
        instruments.forEach((inst: Instrument) => {
            const updateInst: Instrument = {...inst, tunings: inst.tunings.map((tuning: Tuning) => {
                if (tuning.id === updatedTuning.id) {
                    if (inst.id === selectedInstrument.id) {
                        currentInstHasTuning = true;
                    }
                    return updatedTuning;
                } else {
                    return tuning;
                }
                })};
            if (currentInstHasTuning) {
                currentInst = updateInst;
            }
            updatedInstruments.push(updateInst);
        });
        updateTuning(changes, updatedTuning.id)
            .then(() => {
                setTunings(tunings.map((tuning) => {return tuning.id === updatedTuning.id? updatedTuning : tuning}));
                setSelectedTuning(updatedTuning);
                setInstruments(updatedInstruments);
                if (currentInstHasTuning) {
                    setSelectedInstrument(currentInst);
                }
                setMessageClass('text-blue-400');
                setMessage('Tuning updated successfully!');
                setTimeout(() => {
                    setMessage('');
                }, 2000);})
            .catch((e) => {
                console.error(e);
                setMessageClass('text-red-400');
                setMessage('Could not update tuning');
                setTimeout(() => {
                    setMessage('');
                }, 3000)
        });
    };

    const onAddTuning = async (newTuning: Tuning) => {
        addTuning(newTuning)
            .then((tuningID) => {
                newTuning.id = tuningID;
                updateUser({tunings: [...userData.tunings, tuningID]}, userData.id);
            })
            .then(() => {
                setTunings([...tunings, newTuning]);
                setSelectedTuning(newTuning);
                setMessageClass('text-blue-400');
                setMessage('Tuning added successfully!');
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            }).catch((e) => {
            console.error(e);
            setMessageClass('text-red-400');
            setMessage('Could not add tuning');
            setTimeout(() => {
                setMessage('');
            }, 3000)
        })
    }

    const handleDeleteTuning = (tuningID?: string) => {
        const updatedInstruments: Instrument[] = [];
        const instsToUpdate: Instrument[] = [];
        let currentInstHasTuning = false;
        let currentInst: Instrument;
        instruments.forEach((inst: Instrument) => {
            const updateInst = {...inst, tunings: inst.tunings.filter((tuning: Tuning) => {
                    if (tuning.id !== tuningID){
                        return true;
                    } else {
                        if (inst.id === selectedInstrument.id) {
                            currentInstHasTuning = true;
                        }
                        instsToUpdate.push(inst);
                        return false;
                    }
                })};
            if (currentInstHasTuning) {
                currentInst = updateInst;
            }
            updatedInstruments.push(updateInst);
        });
        const updatedTunings = tunings
            .filter((tuning: Tuning) => tuning.id !== tuningID);
        deleteTuning(tuningID)
            .then(() => updateUser({tunings: updatedTunings.map((tuning: Tuning) => tuning.id)}, userData.id))
            .then(() => {
                instsToUpdate.forEach((inst: Instrument) => {
                    updateInstrument({tunings: inst.tunings.map((tuning: Tuning) => tuning.id)}, userData.id)
                        .catch((e) => console.error(e));
                })
            })
            .then(() => {
                setInstruments(updatedInstruments);
                if (currentInstHasTuning && currentInst){
                    setSelectedInstrument(currentInst);
                }
                setTunings(updatedTunings);
                setSelectedTuning(updatedTunings[0]);
                setMessageClass('text-blue-400');
                setMessage('Tuning successfully deleted');
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            })
            .catch((e) => {
                console.error(e);
                setMessageClass('text-red-400');
                setMessage('Error deleting tuning!');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            });
    };

    const handleAddTuningToInstrument = async () => {
        if (selectedInstrument.tunings.some(tuning => tuning.id === selectedTuning.id)) {
            setMessageClass('text-red-500');
            setMessage('Instrument already has this tuning!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }
        if (selectedInstrument.type !== selectedTuning.type || selectedInstrument.strings !== selectedTuning.strings.length) {
            setMessageClass('text-red-500');
            setMessage('Tuning does not match instrument\'s type or string count.');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }
        const newTuningIDs = [...selectedInstrument.tunings, selectedTuning].map((tuning) => tuning.id);
        const updatedInstrument = {
            ...selectedInstrument,
            tunings: [...selectedInstrument.tunings, selectedTuning]
        };
        onUpdateInstrument({tunings: newTuningIDs}, updatedInstrument).catch((error) => {
            console.log(error);
        })
    };

    // Averager functions
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

    const handleSubmitGetAv = (selectedTuningNames: string[], wound3rd: boolean) => {
        const selectedTunings: Tuning[] = selectedInstrument.tunings.filter((tuning) => selectedTuningNames.includes(tuning.name));
        const avTuning = stringAverage(selectedTunings);
        console.log(avTuning)
        if (avTuning) {
            setAverageTuning(avTuning);
            const stringSet: StringSet = {
                gauges: [],
                woundStrings: [],
                name: '',
                tensions: [],
                noteValues: avTuning
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
                const gauge = stringGauge(UWs[index], coeff, power);

                stringSet.gauges.push(gauge);
                stringSet.woundStrings.push(wound);
                stringSet.tensions.push(tension(uwFromGauge(gauge, coeff, power), note, selectedInstrument.scale));
            });
            //setUnitWeights(UWs);
            console.log(stringSet)
            setAvStringSet(stringSet);
        }
        setIsAveragerOpen(true);
    };

    const handleSubmitStringSet = (newStringSet: StringSet) => {
        const updatedInstrument = {...selectedInstrument, stringSets: [...selectedInstrument.stringSets, newStringSet]};
        onUpdateInstrument({stringSets: updatedInstrument.stringSets}, updatedInstrument).catch((e) => console.error(e));
    };

    // UI handlers
    const handleCloseTuningInput = () => {
        setIsTuningInputOpen(false);
        setIsEdit(false);
    };

    const handleCloseInstInput = () => {
        setIsInstInputOpen(false);
        setIsEdit(false);
    };

    const handleEditInst = () => {
        setIsEdit(true);
        setIsInstInputOpen(true);
    };

    const handleEditTuning = () => {
        setIsEdit(true);
        setIsTuningInputOpen(true);
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
                        {instruments.map((instrument) => (
                            <option key={instrument.id} value={instrument.id}>
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
                            onClick={() => setIsInstDeleteOpen(true)}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="justify-items-start">
                        <p><strong>Type: </strong>{capitalize(selectedInstrument.type)}</p>
                        <p><strong>Scale Length: </strong>{selectedInstrument.scale}"</p>
                        <p><strong>Target
                            Tensions: </strong>{selectedInstrument.targetTension.map((tension, index) => (
                            <span key={index}>{round(tension, DECIMAL_POINTS)} {index < selectedInstrument.targetTension.length -1 ? "| " : ""} </span>
                        ))}
                        </p>
                        <label><strong>Tunings:</strong></label>
                        <ul className="mb-3 justify-items-start">
                            {selectedInstrument.tunings.map((tuning) => (
                                <li className="cursor-pointer" onClick={() => setSelectedTuning(tuning)}
                                    key={tuning.id}>{tuning.name}</li>
                            ))}
                        </ul>
                        <label><strong>String Sets:</strong></label>
                        <ul className="mb-3 justify-items-start">
                            {selectedInstrument.stringSets.map((set, idx) => (
                                <li key={idx}><em>{set.name}: </em>{set.gauges.map((gauge, index) => (
                                        <span key={index}>{gauge}{!set.woundStrings[index]? "p" : ""} {index < set.gauges.length - 1 ? "| " : ""} </span>
                                ))}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-grow space-4">
                        <button
                            className="bg-blue-600 text-white m-2 px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2"
                            onClick={() => setIsInstInputOpen(true)}
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
                        {tunings.map((tuning) => (
                            <option key={tuning.id} value={tuning.id}>
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
                            onClick={() => setIsTuningDeleteOpen(true)}
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
                            onClick={() => setIsTuningInputOpen(true)}
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
                onClose={() => setIsTuningConfirmOpen(false)}
                onSubmit={handleSubmitGetAv}
                tunings={selectedInstrument.tunings}
                instrument={selectedInstrument.name}
                defaultChecked={Array(selectedInstrument.tunings.length).fill(true)}
            />
            <TuningInput
                notes={notes}
                presetTunings={tunings}
                defaultTunings={defaultTunings}
                onSubmit={onAddTuning}
                isOpen={isTuningInputOpen}
                onClose={handleCloseTuningInput}
                isEdit={isEdit}
                editTuning={selectedTuning}
                onEdit={onUpdateTuning}
            />
            <InstrumentInput
                onSubmit={onAddInstrument}
                onEdit={onUpdateInstrument}
                tunings={tunings}
                targetTensions={defaultTensions}
                stringRange={stringRange}
                isOpen={isInstInputOpen}
                onClose={handleCloseInstInput}
                isEdit={isEdit}
                editInstrument={selectedInstrument}
            />
            <AverageStringSet
                stringSet={avStringSet}
                isOpen={isAveragerOpen}
                onClose={() => setIsAveragerOpen(false)}
                onSubmit={handleSubmitStringSet}
                averageTuning={averageTuning}
                instrument={selectedInstrument}
            />
            <DeleteConfirm
                isOpen={isInstDeleteOpen}
                onClose={() => setIsInstDeleteOpen(false)}
                deleteFunction={() => handleDeleteInst(selectedInstrument.id)}
            />
            <DeleteConfirm
                isOpen={isTuningDeleteOpen}
                onClose={() => setIsTuningDeleteOpen(false)}
                deleteFunction={() => handleDeleteTuning(selectedTuning.id)}
            />
        </div>
    );
};

export default HomePage;