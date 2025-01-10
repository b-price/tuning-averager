import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { UserData, UserSettings } from "../../../types.ts";
import {defaultSettings, defaultUser, REFERENCE_PITCH} from "../defaults.ts";
import { getUser, updateUser } from "../utils/serverFunctions.ts";
import ToggleSwitch from "./ToggleSwitch.tsx";
import {useTernaryDarkMode} from 'usehooks-ts';

const Settings: React.FC = () => {
    const { userId } = useAuth();
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const {
        isDarkMode,
        ternaryDarkMode,
        setTernaryDarkMode,
        toggleTernaryDarkMode,
    } = useTernaryDarkMode()

    useEffect(() => {
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
    }, [userId]);

    const handleUseOSThemeSwitch = (checked: boolean) => {
        updateUser({ settings: { ...settings, useOSTheme: checked } }, user.id).then(() => {
            setSettings({ ...settings, useOSTheme: checked });
            setUser({ ...user, settings: { ...settings, useOSTheme: checked } });
            setTernaryDarkMode(checked ? "system" : settings.darkMode ? "dark" : "light")
        });
        // if (checked) {
        //     removeLocalStorageTheme();
        //     console.log(localStorage.getItem('theme'));
        // } else {
        //     setLocalStorageTheme(settings.darkMode);
        //     console.log(localStorage.getItem('theme'));
        // }

    };

    // const removeLocalStorageTheme = () => {
    //     localStorage.removeItem('theme');
    //     window.dispatchEvent(new Event('storage'));
    // }
    //
    // const setLocalStorageTheme = (dark: boolean) => {
    //     localStorage.setItem('theme', dark ? "dark" : "light");
    //     window.dispatchEvent(new Event('storage'));
    // }

    const handleDarkModeSwitch = (checked: boolean) => {
        updateUser({ settings: { ...settings, darkMode: checked } }, user.id).then(() => {
            setSettings({ ...settings, darkMode: checked });
            setUser({ ...user, settings: { ...settings, darkMode: checked } });
            setTernaryDarkMode(checked ? "dark" : "light");
        });
        // if (!settings.useOSTheme) {
        //     setLocalStorageTheme(checked);
        // }

    };

    const handleWeightedModeSwitch = (checked: boolean) => {
        updateUser({ settings: { ...settings, weightedMode: checked } }, user.id).then(() => {
            setSettings({ ...settings, weightedMode: checked });
            setUser({ ...user, settings: { ...settings, weightedMode: checked } });
        });
    };

    const handleRefPitchChange = (pitch: number) => {
        if (pitch > 0 && pitch < 2000) {
            updateUser({ settings: { ...settings, referencePitch: pitch } }, user.id).then(() => {
                setSettings({ ...settings, referencePitch: pitch });
                setUser({ ...user, settings: { ...settings, referencePitch: pitch } });
            });
        }

    }

    if (isLoading) {
        return <p className="text-center mt-4">Loading...</p>;
    }

    return (
        <div className="container p-4 sm:p-6 sm:w-3/4 sm:max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Settings</h1>
            <div className="grid gap-6 w-full mx-auto">
                {/* Profile Settings */}
                <div className="flex flex-row items-center gap-4">
                    <h2 className="text-xl font-semibold">Profile Settings →</h2>
                    <UserButton afterSignOutUrl="/"/>
                </div>

                <h2 className="text-xl font-semibold">App Settings</h2>
                {/* Weighted Mode */}
                <ToggleSwitch
                    checked={settings.weightedMode}
                    onChange={(e) => handleWeightedModeSwitch(e.target.checked)}
                    twStyle="flex flex-col gap-2"
                >
                    <span className="ml-3 font-semibold">Weighted Mode</span>
                </ToggleSwitch>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                    If weighted mode is on, when the tunings of an instrument are averaged, how often a string is
                    tuned to a note is taken into account. Otherwise, it is not.
                </p>
                {/*Reference Pitch*/}
                <div className="flex items-center">
                    <label className="mr-3 font-semibold">Reference Pitch</label>
                    <label className="mr-1">A4=</label>
                    <input
                        type="number"
                        value={settings.referencePitch || REFERENCE_PITCH}
                        step={1}
                        onChange={(e) => handleRefPitchChange(parseFloat(e.target.value))}
                        className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label className="px-1">hz</label>
                </div>

                {/*Theme*/}
                <h2 className="text-xl font-semibold">Theme</h2>
                <ToggleSwitch
                    checked={settings.useOSTheme}
                    onChange={(e) => handleUseOSThemeSwitch(e.target.checked)}
                    twStyle="flex flex-col gap-2"
                >
                    <span className="ml-3 font-semibold">Use OS color theme</span>
                </ToggleSwitch>
                {!settings.useOSTheme && (
                    <ToggleSwitch
                        checked={settings.darkMode}
                        onChange={(e) => handleDarkModeSwitch(e.target.checked)}
                        twStyle="flex flex-col gap-2"
                    >
                        <span className="ml-3 font-semibold">Dark Mode</span>
                    </ToggleSwitch>
                )}
            </div>
        </div>
    );
};

export default Settings;