import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import {Tuning, UserData, UserSettings} from "../../types.ts";
import {
    DEFAULT_SETTINGS,
    DEFAULT_USER, EXPANSION_PACK_NAME,
    LOCAL_INSTS_KEY,
    LOCAL_TUNINGS_KEY,
    LOCAL_USERDATA_KEY,
    REFERENCE_PITCH,
} from "../defaults.ts";
import {getPublicTunings, getUser, updateUser} from "../utils/serverFunctions.ts";
import ToggleSwitch from "./ToggleSwitch.tsx";
import { Link } from "react-router-dom";
import DeleteConfirm from "./DeleteConfirm.tsx";
import { useMessage } from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";
import LoadingSkeleton from "./LoadingSkeleton.tsx";
import ArrowSelectorHorizontal from "./ArrowSelectorHorizontal.tsx";
import {TUNING_EXPANSION_IDS} from "../tuningExpansion.ts";

const Settings: React.FC = () => {
    const { userId } = useAuth();
    const [user, setUser] = useState<UserData>(DEFAULT_USER);
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isDeleteDataConfirmOpen, setIsDeleteDataConfirmOpen] = useState(false);
    const [isDeleteTuningExpOpen, setIsDeleteTuningExpOpen] = useState(false);
    const { message, messageType, showMessage, show, closeMessage } =
        useMessage();

    // on mount
    useEffect(() => {
        if (userId) {
            getUser(userId)
                .then((userData) => {
                    setUser(userData);
                    if (userData.settings) {
                        setSettings(userData.settings);
                        // if (userData.settings.useOSTheme){
                        //     removeLocalStorageTheme();
                        // } else {
                        //     setLocalStorageTheme(userData.settings.darkMode);
                        // }
                    }
                })
                .then(() => setIsLoading(false))
                .catch((e) => console.error(e));
        } else {
            try {
                const userData = localStorage.getItem(LOCAL_USERDATA_KEY);
                if (userData) {
                    setUser(JSON.parse(userData));
                    setSettings(JSON.parse(userData).settings);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [userId]);

    // const handleUseOSThemeSwitch = (checked: boolean) => {
    //     if (userId) {
    //         updateUser({ settings: { ...settings, useOSTheme: checked } }, user.id).then(() => {
    //             setSettings({ ...settings, useOSTheme: checked });
    //             setUser({ ...user, settings: { ...settings, useOSTheme: checked } });
    //             setTernaryDarkMode(checked ? "system" : settings.darkMode ? "dark" : "light");
    //         });
    //     } else {
    //         try {
    //             localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify({ settings: { ...settings, useOSTheme: checked } }));
    //             setSettings({ ...settings, useOSTheme: checked });
    //             setUser({ ...user, settings: { ...settings, useOSTheme: checked } });
    //             setTernaryDarkMode(checked ? "system" : settings.darkMode ? "dark" : "light");
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    //
    //     // if (checked) {
    //     //     removeLocalStorageTheme();
    //     //     console.log(localStorage.getItem('theme'));
    //     // } else {
    //     //     setLocalStorageTheme(settings.darkMode);
    //     //     console.log(localStorage.getItem('theme'));
    //     // }
    //
    // };

    // const removeLocalStorageTheme = () => {
    //     localStorage.removeItem('theme');
    //     window.dispatchEvent(new Event('storage'));
    // }
    //
    // const setLocalStorageTheme = (dark: boolean) => {
    //     localStorage.setItem('theme', dark ? "dark" : "light");
    //     window.dispatchEvent(new Event('storage'));
    // }

    // const handleDarkModeSwitch = (checked: boolean) => {
    //     if (userId) {
    //         updateUser({ settings: { ...settings, darkMode: checked } }, user.id).then(() => {
    //             setSettings({ ...settings, darkMode: checked });
    //             setUser({ ...user, settings: { ...settings, darkMode: checked } });
    //             setTernaryDarkMode(checked ? "dark" : "light");
    //         });
    //         // if (!settings.useOSTheme) {
    //         //     setLocalStorageTheme(checked);
    //         // }
    //     } else {
    //         try {
    //             localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify({...user, settings: { ...settings, darkMode: checked }}));
    //             setSettings({ ...settings, darkMode: checked });
    //             setUser({ ...user, settings: { ...settings, darkMode: checked } });
    //             setTernaryDarkMode(checked ? "dark" : "light");
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // };

    const handleWeightedModeSwitch = (checked: boolean) => {
        if (userId) {
            updateUser(
                { settings: { ...settings, weightedMode: checked } },
                user.id,
            ).then(() => {
                setSettings({ ...settings, weightedMode: checked });
                setUser({
                    ...user,
                    settings: { ...settings, weightedMode: checked },
                });
            });
        } else {
            try {
                localStorage.setItem(
                    LOCAL_USERDATA_KEY,
                    JSON.stringify({
                        ...user,
                        settings: { ...settings, weightedMode: checked },
                    }),
                );
                setSettings({ ...settings, weightedMode: checked });
                setUser({
                    ...user,
                    settings: { ...settings, weightedMode: checked },
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleReverseStringSwitch = (checked: boolean) => {
        if (userId) {
            updateUser(
                { settings: { ...settings, reverseStrings: checked } },
                user.id,
            ).then(() => {
                setSettings({ ...settings, reverseStrings: checked });
                setUser({
                    ...user,
                    settings: { ...settings, reverseStrings: checked },
                });
            });
        } else {
            try {
                localStorage.setItem(
                    LOCAL_USERDATA_KEY,
                    JSON.stringify({
                        ...user,
                        settings: { ...settings, reverseStrings: checked },
                    }),
                );
                setSettings({ ...settings, reverseStrings: checked });
                setUser({
                    ...user,
                    settings: { ...settings, reverseStrings: checked },
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleRefPitchChange = (pitch: number) => {
        if (pitch > 0 && pitch < 2000) {
            if (userId) {
                updateUser(
                    { settings: { ...settings, referencePitch: pitch } },
                    user.id,
                ).then(() => {
                    setSettings({ ...settings, referencePitch: pitch });
                    setUser({
                        ...user,
                        settings: { ...settings, referencePitch: pitch },
                    });
                });
            } else {
                try {
                    localStorage.setItem(
                        LOCAL_USERDATA_KEY,
                        JSON.stringify({
                            ...user,
                            settings: { ...settings, referencePitch: pitch },
                        }),
                    );
                    setSettings({ ...settings, referencePitch: pitch });
                    setUser({
                        ...user,
                        settings: { ...settings, referencePitch: pitch },
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    const addTuningsExpansion = () => {
        if (!settings.hasTuningExpansion) {
            if (userId) {
                updateUser(
                    { tunings: [...user.tunings, ...TUNING_EXPANSION_IDS] },
                    userId,
                )
                    .then(() => {
                        setUser({
                            ...user,
                            tunings: [...user.tunings, ...TUNING_EXPANSION_IDS],
                            settings: {
                                ...user.settings,
                                hasTuningExpansion: true,
                            },
                        });
                        setSettings({ ...settings, hasTuningExpansion: true });
                        showMessage(`${EXPANSION_PACK_NAME} added!`, "success");
                    })
                    .catch((e) => {
                        console.error(e);
                        showMessage(`${EXPANSION_PACK_NAME} could not be added.`, `error`);
                    });
            } else {
                    getPublicTunings().then((response) => {
                        if (response) {
                            const localTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
                            const updatedTunings = localTunings
                                ? [...JSON.parse(localTunings), ...response.data]
                                : [...response.data];
                            localStorage.setItem(
                                LOCAL_TUNINGS_KEY,
                                JSON.stringify(updatedTunings),
                            );
                            localStorage.setItem(
                                LOCAL_USERDATA_KEY,
                                JSON.stringify({
                                    ...user,
                                    settings: { ...settings, hasTuningExpansion: true },
                                }),
                            );
                            setSettings({ ...settings, hasTuningExpansion: true });
                            setUser({
                                ...user,
                                settings: { ...settings, hasTuningExpansion: true },
                            });
                            showMessage(`${EXPANSION_PACK_NAME} added!`, "success");
                        }
                    }).catch((e) => {
                        console.error(e);
                        showMessage(`Cannot add ${EXPANSION_PACK_NAME}.`, `error`);
                    })
            }
        }
    }

    const removeTuningsExpansion = () => {
        if (settings.hasTuningExpansion) {
            if (userId) {
                const updatedTuningIDs = user.tunings.filter(id => !TUNING_EXPANSION_IDS.includes(id));
                updateUser(
                    { tunings: updatedTuningIDs },
                    userId,
                )
                    .then(() => {
                        setUser({
                            ...user,
                            tunings: updatedTuningIDs,
                            settings: {
                                ...user.settings,
                                hasTuningExpansion: false,
                            },
                        });
                        setSettings({ ...settings, hasTuningExpansion: false });
                        showMessage(`${EXPANSION_PACK_NAME} removed.`, "success");
                    })
                    .catch((e) => {
                        console.error(e);
                        showMessage(`${EXPANSION_PACK_NAME} could not be removed.`, `error`);
                    });
            } else {
                const localTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
                if (localTunings)  {
                    const updatedTunings = JSON.parse(localTunings).filter((tuning: Tuning) => !tuning.id || !TUNING_EXPANSION_IDS.includes(tuning.id));
                    localStorage.setItem(
                        LOCAL_TUNINGS_KEY,
                        JSON.stringify(updatedTunings),
                    );
                    showMessage(`${EXPANSION_PACK_NAME} removed`, "success");
                } else {
                    showMessage(`${EXPANSION_PACK_NAME} does not exist in your account.`, "warning");
                }
                localStorage.setItem(
                    LOCAL_USERDATA_KEY,
                    JSON.stringify({
                        ...user,
                        settings: { ...settings, hasTuningExpansion: false },
                    }),
                );
                setSettings({ ...settings, hasTuningExpansion: false });
                setUser({
                    ...user,
                    settings: { ...settings, hasTuningExpansion: false },
                });
            }
        }
    }

    const deleteLocalData = () => {
        try {
            localStorage.setItem(
                LOCAL_USERDATA_KEY,
                JSON.stringify(DEFAULT_USER),
            );
            localStorage.setItem(LOCAL_INSTS_KEY, JSON.stringify([]));
            localStorage.setItem(LOCAL_TUNINGS_KEY, JSON.stringify([]));
            setUser(DEFAULT_USER);
            setSettings(DEFAULT_SETTINGS);
            showMessage("Local data deleted.", "success");
        } catch (e) {
            console.error(e);
            showMessage("Could not delete local data.", "error");
        }
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="flex flex-col p-6 mx-4 my-4 sm:mx-0">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Settings
            </h1>
            <div className="grid gap-6 w-full mx-auto">
                {/* Profile Settings */}
                {userId ? (
                    <div className="flex flex-row items-center gap-4">
                        <h2 className="text-xl font-semibold">
                            Profile Settings →
                        </h2>
                        <UserButton />
                    </div>
                ) : (
                    <div className="flex items-center mb-4 justify-center sm:justify-start">
                        <Link to={"/sign-up"}>
                            <h1 className="text-xl font-semibold">
                                Sign up to save your settings!
                            </h1>
                        </Link>
                    </div>
                )}

                <h2 className="text-xl font-semibold sm:text-left">
                    App Settings
                </h2>
                <ToggleSwitch
                    checked={
                        settings.reverseStrings
                            ? settings.reverseStrings
                            : false
                    }
                    onChange={(e) =>
                        handleReverseStringSwitch(e.target.checked)
                    }
                    twStyle="flex flex-col gap-2"
                >
                    <span className="ml-3 font-semibold">
                        Reverse String Order Display
                    </span>
                </ToggleSwitch>
                {/* Weighted Mode */}
                <ToggleSwitch
                    checked={settings.weightedMode}
                    onChange={(e) => handleWeightedModeSwitch(e.target.checked)}
                    twStyle="flex flex-col gap-2"
                >
                    <span className="ml-3 font-semibold">Weighted Mode</span>
                </ToggleSwitch>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left max-w-2xl">
                    If weighted mode is on, when the tunings of an instrument
                    are averaged, how often a string is tuned to a note is taken
                    into account. Otherwise, it is not.
                </p>
                {/*Reference Pitch*/}
                <div className="flex items-center">
                    <label className="mr-3 font-semibold">
                        Reference Pitch
                    </label>
                    <label className="mr-1">A4=</label>
                    <ArrowSelectorHorizontal
                        min={1}
                        max={2000}
                        step={1}
                        value={settings.referencePitch || REFERENCE_PITCH}
                        onChange={(pitch) => handleRefPitchChange(pitch)}
                        errorState={false}
                    />
                    <label className="px-1">hz</label>
                </div>
                {settings.hasTuningExpansion ? (
                    <div>
                        <div className="flex sm:justify-start justify-center mb-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                onClick={() => setIsDeleteTuningExpOpen(true)}
                            >
                                Delete {EXPANSION_PACK_NAME}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-left max-w-2xl">
                            Removes all expansion pack tunings from your
                            account, and your instruments!
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="flex sm:justify-start justify-center mb-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2"
                                onClick={addTuningsExpansion}
                            >
                                Add {EXPANSION_PACK_NAME}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-left max-w-2xl">
                            Adds {TUNING_EXPANSION_IDS.length} tunings to your
                            list of tunings! Includes all popular alternate
                            tunings for bass, guitar, and other stringed
                            instruments, along with some weirder tunings from
                            Sonic Youth, Soundgarden, My Bloody Valentine, and
                            more.
                        </p>
                    </div>
                )}
                {/*Local Mode Delete Data*/}
                {!userId && (
                    <div className="flex sm:justify-start justify-center">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                            onClick={() => setIsDeleteDataConfirmOpen(true)}
                        >
                            Delete Local Data
                        </button>
                    </div>
                )}

                {/*Theme*/}
                {/*<h2 className="text-xl font-semibold sm:text-left">Theme</h2>*/}
                {/*<ToggleSwitch*/}
                {/*    checked={settings.useOSTheme}*/}
                {/*    onChange={(e) => handleUseOSThemeSwitch(e.target.checked)}*/}
                {/*    twStyle="flex flex-col gap-2"*/}
                {/*>*/}
                {/*    <span className="ml-3 font-semibold">Use OS color theme</span>*/}
                {/*</ToggleSwitch>*/}
                {/*{!settings.useOSTheme && (*/}
                {/*    <ToggleSwitch*/}
                {/*        checked={settings.darkMode}*/}
                {/*        onChange={(e) => handleDarkModeSwitch(e.target.checked)}*/}
                {/*        twStyle="flex flex-col gap-2"*/}
                {/*    >*/}
                {/*        <span className="ml-3 font-semibold">Dark Mode</span>*/}
                {/*    </ToggleSwitch>*/}
                {/*)}*/}
            </div>
            <DeleteConfirm
                isOpen={isDeleteDataConfirmOpen}
                onClose={() => setIsDeleteDataConfirmOpen(false)}
                deleteFunction={deleteLocalData}
            />
            <DeleteConfirm
                isOpen={isDeleteTuningExpOpen}
                onClose={() => setIsDeleteTuningExpOpen(false)}
                deleteFunction={removeTuningsExpansion}
            />
            <Alert
                show={show}
                message={message}
                type={messageType}
                onClose={closeMessage}
                style="mt-6 mb-4 justify-center"
            />
        </div>
    );
};

export default Settings;
