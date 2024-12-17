import React, {useEffect, useState} from 'react';
import TuningConfirm from "./TuningConfirm.tsx";
import TuningInput from "./TuningInput.tsx";
import InstrumentInput from "./InstrumentInput.tsx";
import {
    DECIMAL_POINTS, DEFAULT_INST, DEFAULT_TUNING,
    notes,
    stringTypeFactors
} from "../defaults.ts";
import {Instrument, StringSet, Tuning, UserData} from "../../../types.ts";
import {
    capitalize, getPW,
    getUnitWeight,
    round,
    stringAverage,
    stringAverageUnweighted,
    stringGauge,
    tension,
    uwFromGauge
} from "../utils/calculate.ts";

import {
    addInstrument, addTuning,
    deleteInstrument, deleteTuning,
    getInstruments,
    getTunings,
    updateInstrument, updateTuning,
    updateUser
} from "../utils/serverFunctions.ts";
import DeleteConfirm from "./DeleteConfirm.tsx";
import {UserButton} from '@clerk/clerk-react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import AverageStringSet from "./AverageStringSet.tsx";
import StringSets from "./StringSets.tsx";

interface HomeProps {
    userData: UserData;
}

const HomePage: React.FC<HomeProps> = ({ userData }) => {

    const [tunings, setTunings] = useState<Tuning[]>([]);
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(
        instruments.length? instruments[0] : DEFAULT_INST
    );
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(
        instruments.length && instruments[0].tunings.length? instruments[0].tunings[0] : DEFAULT_TUNING
    );
    const [message, setMessage] = useState<string>('');
    const [messageClass, setMessageClass] = useState<string>('text-blue-400');
    const [isTuningConfirmOpen, setIsTuningConfirmOpen] = useState(false);
    const [isTuningInputOpen, setIsTuningInputOpen] = useState(false);
    const [isInstInputOpen, setIsInstInputOpen] = useState(false);
    const [isAveragerOpen, setIsAveragerOpen] = useState(false);
    const [avStringSet, setAvStringSet] = useState<StringSet>(
        instruments.length && instruments[0].stringSets.length? instruments[0].stringSets[0]: DEFAULT_INST.stringSets[0]
    );
    //const [averageTuning, setAverageTuning] = useState<number[]>([]);
    //const [unitWeights, setUnitWeights] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInstDeleteOpen, setIsInstDeleteOpen] = useState(false);
    const [isTuningDeleteOpen, setIsTuningDeleteOpen] = useState(false);
    const [isStringSetsOpen, setIsStringSetsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // On mount
    useEffect(() => {
        setIsLoading(true);
        getTunings(userData)
            .then((data) => {
                if (data && data.userData && data.userTunings) {
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

    if (isLoading || userData === undefined) {
        return (
            <SkeletonTheme baseColor="#444444" highlightColor="#666666">
                <div className="flex flex-col p-6">
                    <div className="flex items-center mb-4 gap-4">
                        <Skeleton circle height={50} width={50}/>
                        <Skeleton height={30} width={150}/>
                    </div>
                    <div className="flex flex-wrap gap-10">
                        {/* Instruments Skeleton */}
                        <div className="mb-7">
                            <Skeleton height={30} width={200}/>
                            <Skeleton height={50} width={300} style={{marginTop: '10px'}}/>
                            <Skeleton height={20} width={150} style={{marginTop: '10px'}}/>
                            <Skeleton height={20} width={250} style={{marginTop: '10px'}}/>
                            <Skeleton height={20} width={200} style={{marginTop: '10px'}}/>
                        </div>
                        {/* Tunings Skeleton */}
                        <div className="mb-2">
                            <Skeleton height={30} width={200}/>
                            <Skeleton height={50} width={300} style={{marginTop: '10px'}}/>
                            <Skeleton height={20} width={150} style={{marginTop: '10px'}}/>
                            <Skeleton height={20} width={250} style={{marginTop: '10px'}}/>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    // Instrument functions
    const onUpdateInstrument = async (changes: object, updatedInst: Instrument) => {
        updateInstrument(changes, updatedInst.id).then(() => {
            setInstruments(instruments.map((inst) => {
                return inst.id === updatedInst.id ? updatedInst : inst
            }));
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
                const instIDs = instruments.map((inst) => inst.id);
                updateUser({instruments: [...instIDs, instID]}, userData.id);
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
                const tuningIDs = tunings.map((tuning: Tuning) => tuning.id);
                updateUser({tunings: [...tuningIDs, tuningID]}, userData.id);
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

    const handleSubmitGetAv = (selectedTunings: Tuning[], wound3rd: boolean) => {
        const avTuning = userData.settings.weightedMode ? stringAverage(selectedTunings) : stringAverageUnweighted(selectedTunings);
        console.log(avTuning)
        if (avTuning) {
            //setAverageTuning(avTuning);
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

    const handleDeleteStringSet = (deletedSet: StringSet) => {
        const newStringSets = selectedInstrument.stringSets.filter((strSet) => strSet !== deletedSet);
        const updatedInstrument = {...selectedInstrument, stringSets: newStringSets};
        onUpdateInstrument({stringSets: newStringSets}, updatedInstrument).catch((e) => console.error(e));
    }

    const handleSubmitStringSet = (newStringSet: StringSet) => {
        const updatedInstrument = {...selectedInstrument, stringSets: [...selectedInstrument.stringSets, newStringSet]};
        onUpdateInstrument({stringSets: updatedInstrument.stringSets}, updatedInstrument).catch((e) => console.error(e));
    };

    const handleOpenEditStringSet = (stringSet: StringSet) => {
        setAvStringSet(stringSet);
        setIsEdit(true);
        setIsStringSetsOpen(false);
        setIsAveragerOpen(true);
    }

    const handleEditStringSet = (stringSet: StringSet) => {
        const newStringSets = selectedInstrument.stringSets.map((strSet: StringSet) => {
            if (strSet.id === stringSet.id){
                return stringSet;
            } else {
                return strSet;
            }
        });
        const updatedInstrument = {...selectedInstrument, stringSets: newStringSets};
        onUpdateInstrument({stringSets: newStringSets}, updatedInstrument).catch((e) => console.error(e));
    }

    // UI handlers
    const handleCloseTuningInput = () => {
        setIsTuningInputOpen(false);
        setIsEdit(false);
    };

    const handleCloseInstInput = () => {
        setIsInstInputOpen(false);
        setIsEdit(false);
    };

    const handleCloseStringAverage = () => {
        setIsAveragerOpen(false);
        setIsEdit(false);
    }

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
            <div className="flex items-center mb-4 gap-4 ">
                <UserButton afterSignOutUrl='sign-in'/>
                <h1 className="text-2xl font-bold">{userData.username}</h1>
            </div>
            <div className="flex flex-wrap gap-10">


                {/*Instruments*/}
                <div className="mb-7">
                    <label htmlFor="instrument-select" className="block text-xl font-semibold">
                        Instruments
                    </label>
                    {
                        instruments.length ?
                            (<div>
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
                                        <span
                                            key={index}>{round(tension, DECIMAL_POINTS)} {index < selectedInstrument.targetTension.length - 1 ? "| " : ""} </span>
                                    ))}
                                    </p>
                                    <label><strong>Tunings:</strong></label>
                                    <ul className="mb-3 justify-items-start">
                                        {selectedInstrument.tunings.map((tuning) => (
                                            <li className="cursor-pointer hover:text-indigo-400" onClick={() => setSelectedTuning(tuning)}
                                                key={tuning.id}>{tuning.name}</li>
                                        ))}
                                    </ul>
                                    <div className="">
                                        <label><strong>String Sets:</strong></label>
                                        <button
                                            className="bg-gray-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                                            onClick={() => setIsStringSetsOpen(true)}>Edit</button>
                                    </div>
                                    <ul className="mb-3 justify-items-start">
                                        {selectedInstrument.stringSets.map((set, idx) => (
                                            <li key={idx}><em>{set.name}: </em>{set.gauges.map((gauge, index) => (
                                                <span
                                                    key={index}
                                                >
                                                    {gauge}{getPW(gauge, set.woundStrings[index])} {index < set.gauges.length - 1 ? "| " : ""}
                                                </span>
                                            ))}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>)
                            : (<div>
                                    Please add an instrument.
                                </div>
                            )
                    }


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
                            disabled={instruments.length < 1}
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
                    {
                        tunings.length ? (
                            <div>
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
                                <div className="text-start">
                                    <p><strong>Type: </strong>{capitalize(selectedTuning.type)}</p>
                                    <ul className="mb-3">
                                        {selectedTuning.strings.map((string, index) => (
                                            <li key={index}><strong>{index + 1}: </strong>{string.note}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div>
                                Please add a tuning.
                            </div>
                        )
                    }


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
                            disabled={instruments.length < 1 || tunings.length < 1}
                        >
                            Add to Current Inst.
                        </button>
                    </div>
                </div>
            </div>
            {message && <p className={messageClass}>{message}</p>}
            <TuningConfirm
                isOpen={isTuningConfirmOpen}
                onClose={() => setIsTuningConfirmOpen(false)}
                onSubmit={handleSubmitGetAv}
                tunings={selectedInstrument?.tunings}
                instrument={selectedInstrument?.name}
                defaultChecked={Array(selectedInstrument?.tunings.length).fill(true)}
            />
            <TuningInput
                notes={notes}
                presetTunings={tunings}
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
                isOpen={isInstInputOpen}
                onClose={handleCloseInstInput}
                isEdit={isEdit}
                editInstrument={selectedInstrument}
            />
            <AverageStringSet
                stringSet={avStringSet}
                isOpen={isAveragerOpen}
                onClose={handleCloseStringAverage}
                onSubmit={handleSubmitStringSet}
                instrument={selectedInstrument}
                isEdit={isEdit}
                editStringSet={handleEditStringSet}
            />
            <StringSets
                isOpen={isStringSetsOpen}
                onClose={() => setIsStringSetsOpen(false)}
                instrument={selectedInstrument}
                onDelete={handleDeleteStringSet}
                onEdit={handleOpenEditStringSet}
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