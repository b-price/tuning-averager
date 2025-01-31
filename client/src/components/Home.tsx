import React, {useEffect, useMemo, useState} from 'react';
import TuningConfirm from "./TuningConfirm.tsx";
import TuningInput from "./TuningInput.tsx";
import InstrumentInput from "./InstrumentInput.tsx";
import {
    DECIMAL_POINTS, DEFAULT_INST, DEFAULT_TUNING, INST_PRESETS, LOCAL_INSTS_KEY, LOCAL_TUNINGS_KEY, LOCAL_USERDATA_KEY,
    NOTES, REFERENCE_PITCH, WOUND_OVERLAP,
} from "../defaults.ts";
import {Instrument, StringSet, TensionPreset, Tuning, UserData} from "../../types.ts";
import {
    capitalize, coeffPower,
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
import Alert from "./Alert.tsx";
import {useMessage} from "../hooks/useMessage.ts";
import ExportData from "./ExportData.tsx";
import {Link} from "react-router-dom";

interface HomeProps {
    userData: UserData;
    localMode?: boolean;
    localInstruments: Instrument[];
    localTunings: Tuning[];
}

const HomePage: React.FC<HomeProps> = ({ userData, localMode, localInstruments, localTunings }) => {

    const [tunings, setTunings] = useState<Tuning[]>([]);
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [tensionPresets, setTensionPresets] = useState<TensionPreset[]>([]);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(DEFAULT_INST);
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(DEFAULT_TUNING);
    const [isTuningConfirmOpen, setIsTuningConfirmOpen] = useState(false);
    const [isTuningInputOpen, setIsTuningInputOpen] = useState(false);
    const [isInstInputOpen, setIsInstInputOpen] = useState(false);
    const [isAveragerOpen, setIsAveragerOpen] = useState(false);
    const [avStringSet, setAvStringSet] = useState<StringSet>(DEFAULT_INST.stringSets[0]);
    //const [averageTuning, setAverageTuning] = useState<number[]>([]);
    //const [unitWeights, setUnitWeights] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInstDeleteOpen, setIsInstDeleteOpen] = useState(false);
    const [isTuningDeleteOpen, setIsTuningDeleteOpen] = useState(false);
    const [isStringSetsOpen, setIsStringSetsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const { message, messageType, showMessage, show, closeMessage } = useMessage();

    //On mount
    useEffect(() => {
        setTensionPresets(userData.tensionPresets);
        if (localMode) {
            setTunings(localTunings);
            setSelectedTuning(localTunings[0]);
            setInstruments(localInstruments);
            setSelectedInstrument(localInstruments[0]);
        } else {
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
        }

    },[])

    // Memoize the instrument options to prevent recalculating on every render
    const instrumentOptions = useMemo(() => {
        return instruments.map((instrument) => (
            <option key={instrument.id} value={instrument.id}>
                {instrument.name}
            </option>
        ));
    }, [instruments]);

    // Memoize the tuning options to prevent recalculating on every render
    const tuningOptions = useMemo(() => {
        return tunings.map((tuning) => (
            <option key={tuning.id} value={tuning.id}>
                {capitalize(tuning.type)}: {tuning.name}
            </option>
        ));
    }, [tunings]);

    if (isLoading || (userData === undefined && !localMode)) {
        return (
            <SkeletonTheme
                baseColor={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "#444444" : "#cccccc"}
                highlightColor={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "#666666" : "#eeeeee"}
            >
                <div className="flex flex-col sm:p-6">
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
        if (localMode) {
            try {
                const localInsts = localStorage.getItem(LOCAL_INSTS_KEY);
                if (localInsts) {
                    const updatedInsts = JSON.parse(localInsts).map((inst: Instrument) => inst.id === updatedInst.id ? updatedInst : inst);
                    localStorage.setItem(LOCAL_INSTS_KEY, JSON.stringify(updatedInsts));
                    setInstruments(instruments.map((inst) => {
                        return inst.id === updatedInst.id ? updatedInst : inst
                    }));
                    setSelectedInstrument(updatedInst);
                    showMessage('Instrument updated!', 'success');
                }
            } catch (e) {
                console.error(e);
                showMessage('Could not update instrument.', 'error');
            }
        } else {
            updateInstrument(changes, updatedInst.id).then(() => {
                setInstruments(instruments.map((inst) => {
                    return inst.id === updatedInst.id ? updatedInst : inst
                }));
                setSelectedInstrument(updatedInst);
                showMessage('Instrument updated!', 'success');
            }).catch((e) => {
                console.error(e);
                showMessage('Could not update instrument.', 'error');
            });
        }
    };

    const onAddInstrument = async (newInst: Instrument) => {
        if (localMode) {
            try {
                newInst.id = Math.random().toString(36);
                const localInsts = localStorage.getItem(LOCAL_INSTS_KEY);
                const updatedInsts = localInsts ? [...JSON.parse(localInsts), newInst] : [newInst];
                localStorage.setItem(LOCAL_INSTS_KEY, JSON.stringify(updatedInsts));
                setInstruments([...instruments, newInst]);
                setSelectedInstrument(newInst);
                if (newInst.tunings.length > 0) {
                    setSelectedTuning(newInst.tunings[0]);
                }
                showMessage('Instrument added!', 'success');
            } catch (e) {
                console.error(e);
                showMessage('Could not add instrument.', 'error');
            }
        } else {
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
                    showMessage('Instrument added!', 'success');
                }).catch((e) => {
                console.error(e);
                showMessage('Could not add instrument.', 'error');
            })
        }
    };

    const handleDeleteInst = (instID?: string) => {
        const updatedInstruments = instruments
            .filter((inst: Instrument) => inst.id !== instID);
        if (localMode) {
            try {
                const localInsts = localStorage.getItem(LOCAL_INSTS_KEY);
                if (localInsts) {
                    const updatedInsts = JSON.parse(localInsts).filter((inst: Instrument) => inst.id !== instID);
                    localStorage.setItem(LOCAL_INSTS_KEY, JSON.stringify(updatedInsts));
                    setInstruments(updatedInstruments);
                    setSelectedInstrument(updatedInstruments[0]);
                    if (updatedInstruments.length && updatedInstruments[0].tunings.length > 0) {
                        setSelectedTuning(updatedInstruments[0].tunings[0]);
                    }
                    showMessage('Instrument deleted.', 'success');
                }
            } catch (e) {
                console.error(e);
                showMessage('Instrument could not be deleted.', 'error');
            }
        } else {
            deleteInstrument(instID)
                .then(() => updateUser({instruments: updatedInstruments.map((inst: Instrument) => inst.id)}, userData.id))
                .then(() => {
                    setInstruments(updatedInstruments);
                    setSelectedInstrument(updatedInstruments[0]);
                    if (updatedInstruments[0].tunings.length) {
                        setSelectedTuning(updatedInstruments[0].tunings[0]);
                    }
                    showMessage('Instrument deleted.', 'success');
                }).catch((e) => {
                console.error(e);
                showMessage('Instrument could not be deleted.', 'error');
            });
        }

    };

    const updateTensionPresets = async (tensPres: TensionPreset[]) => {
        if (localMode) {
            try {
                const localUserData = localStorage.getItem(LOCAL_USERDATA_KEY);
                if (localUserData) {
                    const updatedUserData = {...JSON.parse(localUserData), tensionPresets: tensPres};
                    localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify(updatedUserData));
                    setTensionPresets(tensPres);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            return updateUser({tensionPresets: tensPres}, userData.id)
                .then(() => setTensionPresets(tensPres))
                .catch((e) => console.error(e));
        }

    }

    // Tuning functions
    const onUpdateTuning = async (changes: object, updatedTuning: Tuning) => {
        const updatedInstruments: Instrument[] = [];
        let currentInstHasTuning = false;
        let currentInst: Instrument | null = null;
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
        if (localMode) {
            try {
                const localTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
                if (localTunings) {
                    const updatedTunings = JSON.parse(localTunings).map((tuning: Tuning) => tuning.id === updatedTuning.id ? updatedTuning : tuning);
                    localStorage.setItem(LOCAL_TUNINGS_KEY, JSON.stringify(updatedTunings));
                    setTunings(updatedTunings);
                    setSelectedTuning(updatedTuning);
                    setInstruments(updatedInstruments);
                    if (currentInstHasTuning && currentInst) {
                        setSelectedInstrument(currentInst);
                    }
                    showMessage('Tuning updated!', 'success');
                }
            } catch (e) {
                console.error(e);
                showMessage('Could not update tuning.', 'error');
            }
        } else {
            updateTuning(changes, updatedTuning.id)
                .then(() => {
                    setTunings(tunings.map((tuning) => {return tuning.id === updatedTuning.id? updatedTuning : tuning}));
                    setSelectedTuning(updatedTuning);
                    setInstruments(updatedInstruments);
                    if (currentInstHasTuning && currentInst) {
                        setSelectedInstrument(currentInst);
                    }
                    showMessage('Tuning updated!', 'success');
                })
                .catch((e) => {
                    console.error(e);
                    showMessage('Could not update tuning.', 'error');
                });
        }
    };

    const onAddTuning = async (newTuning: Tuning) => {
        if (localMode) {
            try {
                newTuning.id = Math.random().toString(36);
                const localTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
                const updatedTunings = localTunings ? [...JSON.parse(localTunings), newTuning] : [newTuning];
                localStorage.setItem(LOCAL_TUNINGS_KEY, JSON.stringify(updatedTunings));
                setTunings([...tunings, newTuning]);
                setSelectedTuning(newTuning);
                showMessage('Tuning added!', 'success');
            } catch (e) {
                console.error(e);
                showMessage('Could not add tuning.', 'error');
            }
        } else {
            addTuning(newTuning)
                .then((tuningID) => {
                    newTuning.id = tuningID;
                    const tuningIDs = tunings.map((tuning: Tuning) => tuning.id);
                    updateUser({tunings: [...tuningIDs, tuningID]}, userData.id);
                })
                .then(() => {
                    setTunings([...tunings, newTuning]);
                    setSelectedTuning(newTuning);
                    showMessage('Tuning added!', 'success');
                }).catch((e) => {
                console.error(e);
                showMessage('Could not add tuning.', 'error');
            })
        }
    }

    const handleDeleteTuning = (tuningID?: string) => {
        const updatedInstruments: Instrument[] = [];
        const instsToUpdate: Instrument[] = [];
        let currentInstHasTuning = false;
        let currentInst: Instrument | null = null;
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
        if (localMode) {
            try {
                const localTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
                if (localTunings) {
                    localStorage.setItem(LOCAL_TUNINGS_KEY, JSON.stringify(updatedTunings));
                    localStorage.setItem(LOCAL_INSTS_KEY, JSON.stringify(updatedInstruments));
                    setTunings(updatedTunings);
                    setSelectedTuning(updatedTunings[0]);
                    setInstruments(updatedInstruments);
                    if (currentInstHasTuning && currentInst) {
                        setSelectedInstrument(currentInst);
                    }
                    showMessage('Tuning deleted.', 'success');
                }
            } catch (e) {
                console.error(e);
                showMessage('Tuning could not be deleted.', 'error');
            }
        } else {
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
                    showMessage('Tuning deleted.', 'success');
                })
                .catch((e) => {
                    console.error(e);
                    showMessage('Error deleting tuning!', 'error');
                });
        }
    };

    const handleAddTuningToInstrument = async () => {
        if (selectedInstrument.tunings.some(tuning => tuning.id === selectedTuning.id)) {
            showMessage('Instrument already has this tuning!', 'error');
            return;
        }
        if (selectedInstrument.type !== selectedTuning.type || selectedInstrument.strings !== selectedTuning.strings.length) {
            showMessage('Tuning does not match instrument\'s type or string count.', 'error');
            return;
        }
        const newTuningIDs = [...selectedInstrument.tunings, selectedTuning].map((tuning) => tuning.id);
        const updatedInstrument = {
            ...selectedInstrument,
            tunings: [...selectedInstrument.tunings, selectedTuning]
        };
        onUpdateInstrument({tunings: newTuningIDs}, updatedInstrument).catch((error) => {
            console.error(error);
        })
    };

    // Averager functions
    const handleOpenGetAv = () => {
        if (selectedInstrument.tunings.length){
            setIsTuningConfirmOpen(true);
        } else {
            showMessage('Instrument has no tunings!', 'error');
        }
    };

    const handleSubmitGetAv = (selectedTunings: Tuning[], wound3rd: boolean, stringMaterial: string) => {
        const avTuning = userData.settings.weightedMode ? stringAverage(selectedTunings) : stringAverageUnweighted(selectedTunings);
        if (avTuning) {
            //setAverageTuning(avTuning);
            const stringSet: StringSet = {
                gauges: [],
                woundStrings: [],
                name: '',
                tensions: [],
                noteValues: avTuning,
                stringMaterial: stringMaterial,
            };
            const UWs: number[] = [];
            avTuning.forEach((note: number, index) => {
                UWs[index] = getUnitWeight(note, selectedInstrument.scale, selectedInstrument.targetTension[index], userData.settings.referencePitch || REFERENCE_PITCH);
                let wound = true;
                if (selectedInstrument.type === 'guitar') {
                    const pwBoundary = selectedInstrument.strings > 9 ? 5 : 2;
                    const wound3rdIndex = selectedInstrument.strings > 9 ? 4 : 2;
                    if (index <= pwBoundary) {
                        wound = false;
                    }
                    if (wound3rd && index === wound3rdIndex){
                        wound = true;
                    }
                }
                // const coeff = stringTypeFactors[selectedInstrument.type][wound? 'wound' : 'plain'].coeff;
                // const power = stringTypeFactors[selectedInstrument.type][wound? 'wound' : 'plain'].power;
                // const plain = getPlain(stringMaterial);
                // const coeff = wound ? STRING_MATERIAL_FACTORS[stringMaterial].coeff : STRING_MATERIAL_FACTORS[plain].coeff;
                // const power = wound ? STRING_MATERIAL_FACTORS[stringMaterial].power : STRING_MATERIAL_FACTORS[plain].power;
                let material = coeffPower(stringMaterial, wound)
                let gauge = stringGauge(UWs[index], material.coeff, material.power);
                if (selectedInstrument.type !== 'guitar') {
                    wound = gauge > (WOUND_OVERLAP[0] + WOUND_OVERLAP[1]) / 2;
                    if (!wound) {
                        material = coeffPower(stringMaterial, wound);
                        gauge = stringGauge(UWs[index], material.coeff, material.power);
                    }
                }

                stringSet.gauges.push(gauge);
                stringSet.woundStrings.push(wound);
                stringSet.tensions.push(tension(uwFromGauge(gauge, material.coeff, material.power), note, selectedInstrument.scale, userData.settings.referencePitch || REFERENCE_PITCH));
            });
            //setUnitWeights(UWs);
            setAvStringSet(stringSet);
        }
        setIsAveragerOpen(true);
    };

    // String Set functions
    const handleDeleteStringSet = (deletedSet: StringSet) => {
        const newStringSets = selectedInstrument.stringSets.filter((strSet) => strSet !== deletedSet);
        const updatedInstrument = {...selectedInstrument, stringSets: newStringSets};
        onUpdateInstrument({stringSets: newStringSets}, updatedInstrument)
            .then(() => {
                if (updatedInstrument.stringSets.length < 1) {
                    setIsStringSetsOpen(false);
                }
            })
            .catch((e) => console.error(e));
    }

    const changeFavStringSet = () => {
        const formerFav: StringSet | undefined = selectedInstrument.stringSets.find((strSet) => strSet.favorite);
        let newStringSets: StringSet[] = [];
        if (formerFav) {
            newStringSets = selectedInstrument.stringSets.filter((strSet) => strSet.id !== formerFav.id);
            formerFav.favorite = false;
            newStringSets.push(formerFav);
        } else {
            newStringSets = selectedInstrument.stringSets;
        }
        return newStringSets;
    }

    const handleSubmitStringSet = (newStringSet: StringSet) => {
        const newStringSets = newStringSet.favorite
            ? [...changeFavStringSet(), newStringSet]
            : [...selectedInstrument.stringSets, newStringSet];
        const updatedInstrument = {...selectedInstrument, stringSets: newStringSets};
        onUpdateInstrument({stringSets: newStringSets}, updatedInstrument).catch((e) => console.error(e));
    };

    const handleEditStringSet = (stringSet: StringSet) => {
        const newStringSets = selectedInstrument.stringSets.map((strSet: StringSet) => {
            if (strSet.id === stringSet.id){
                return stringSet;
            } else if (stringSet.favorite && strSet.favorite) {
                return {...strSet, favorite: false};
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

    const handleOpenEditStringSet = (stringSet: StringSet) => {
        setAvStringSet(stringSet);
        setIsEdit(true);
        setIsStringSetsOpen(false);
        setIsAveragerOpen(true);
    }

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

            {localMode
                ?
                <div className="flex items-center mb-4">
                    <Link to={'/sign-up'}>
                        <h1 className="text-2xl font-semibold dark:text-white">Sign up to save your instruments and
                            tunings!</h1>
                    </Link>
                </div>
                :
                <div className="flex items-center mb-4 gap-4">
                    <UserButton />
                    <h1 className="text-2xl font-bold">{userData.username}</h1>
                </div>
            }

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
                                    {/*{instruments.map((instrument) => (*/}
                                    {/*    <option key={instrument.id} value={instrument.id}>*/}
                                    {/*        {instrument.name}*/}
                                    {/*    </option>*/}
                                    {/*))}*/}
                                    {instrumentOptions}
                                </select>
                                <div className="flex-grow space-3">
                                    <p className="mt-2 text-lg font-medium">{selectedInstrument.name}</p>
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
                                    {selectedInstrument.stringSets && selectedInstrument.stringSets.length > 0 &&
                                        <button
                                            className="bg-indigo-500 text-white text-sm m-2 px-3 py-1.5 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                            onClick={() => setIsStringSetsOpen(true)}
                                        >
                                            String Sets
                                        </button>
                                    }
                                </div>
                                <div className="justify-items-start">
                                    <p><strong>Type: </strong>{capitalize(selectedInstrument.type)}</p>
                                    {selectedInstrument.isMultiscale && selectedInstrument.scales ?
                                        <p><strong>Scale Lengths: </strong>
                                            {selectedInstrument.scales.map((scale, index) => (
                                                <span
                                                    key={index}>{round(scale, DECIMAL_POINTS)} {index < selectedInstrument.strings - 1 ? "| " : ""}
                                            </span>
                                            ))}
                                        </p>
                                        :
                                        <p><strong>Scale Length: </strong>{selectedInstrument.scale}"</p>
                                    }
                                    <p><strong>Target
                                        Tensions: </strong>{selectedInstrument.targetTension.map((tension, index) => (
                                        <span
                                            key={index}>{round(tension, DECIMAL_POINTS)} {index < selectedInstrument.targetTension.length - 1 ? "| " : ""}
                                        </span>
                                    ))}
                                    </p>
                                    <label><strong>Tunings:</strong></label>
                                    <ul className="mb-3 justify-items-start">
                                        {selectedInstrument.tunings.map((tuning) => (
                                            <li className="cursor-pointer hover:text-indigo-400"
                                                onClick={() => setSelectedTuning(tuning)}
                                                key={tuning.id}>{tuning.name}</li>
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
                            className="bg-blue-500 text-white m-2 px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2"
                            onClick={() => setIsInstInputOpen(true)}
                        >
                            New Instrument
                        </button>
                        {instruments.length > 0 &&
                            <button
                                className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                onClick={handleOpenGetAv}
                                disabled={instruments.length < 1}
                            >
                                Get Av. String Set
                            </button>
                        }
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
                                    {/*{tunings.map((tuning) => (*/}
                                    {/*    <option key={tuning.id} value={tuning.id}>*/}
                                    {/*        {capitalize(tuning.type)}: {tuning.name}*/}
                                    {/*    </option>*/}
                                    {/*))}*/}
                                    {tuningOptions}
                                </select>

                                <div className="flex-grow space-3">
                                    <p className="mt-2 text-lg font-medium">{selectedTuning.name}</p>
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
                            className="bg-blue-500 text-white m-2 px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2"
                            onClick={() => setIsTuningInputOpen(true)}
                        >
                            New Tuning
                        </button>
                        {(tunings.length > 0 && instruments.length > 0) &&
                            <button
                                className="bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2"
                                onClick={handleAddTuningToInstrument}
                                disabled={instruments.length < 1 || tunings.length < 1}
                            >
                                Add to Current Inst.
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div>
                <button
                    className="bg-gray-500 text-white m-2 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                    onClick={() => setIsExportOpen(true)}
                >
                    Export Data
                </button>
            </div>
            <Alert show={show} message={message} type={messageType} onClose={closeMessage} style="mt-4"/>
            <TuningConfirm
                isOpen={isTuningConfirmOpen}
                onClose={() => setIsTuningConfirmOpen(false)}
                onSubmit={handleSubmitGetAv}
                tunings={selectedInstrument?.tunings}
                instrument={selectedInstrument}
                defaultChecked={Array(selectedInstrument?.tunings.length).fill(true)}
            />
            <TuningInput
                notes={NOTES}
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
                tensionPresets={tensionPresets}
                updateTensionPresets={updateTensionPresets}
                instrumentPresets={INST_PRESETS}
            />
            <AverageStringSet
                stringSet={avStringSet}
                isOpen={isAveragerOpen}
                onClose={handleCloseStringAverage}
                onSubmit={handleSubmitStringSet}
                instrument={selectedInstrument}
                isEdit={isEdit}
                editStringSet={handleEditStringSet}
                referencePitch={userData.settings.referencePitch}
            />
            <StringSets
                isOpen={isStringSetsOpen}
                onClose={() => setIsStringSetsOpen(false)}
                instrument={selectedInstrument}
                onDelete={handleDeleteStringSet}
                onEdit={handleOpenEditStringSet}
            />
            <ExportData
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                instruments={instruments}
                tunings={tunings}
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