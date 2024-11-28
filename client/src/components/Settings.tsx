import React, {useEffect, useState} from "react";
import {UserButton} from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import {UserData, UserSettings} from "../../../types.ts";
import {defaultSettings, defaultUser} from "../defaults.ts";
import {getUser, updateUser} from "../utils/serverFunctions.ts";

const Settings: React.FC = () => {
    const { userId } = useAuth();
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);

    useEffect(() => {
        getUser(userId)
            .then((userData) => {
                setUser(userData);
                if (userData.settings){
                    setSettings(userData.settings)
                }
            })
            .then(() => setIsLoading(false))
            .catch((e) => console.error(e));

    }, [userId]);

    const handleDarkModeSwitch = (checked: boolean) => {
        updateUser({settings: {...settings, darkMode: checked}}, user.id)
            .then(() => {
                setSettings({...settings, darkMode: checked});
                setUser({...user, settings: {...settings, darkMode: checked}})
            })
    }

    const handleWeightedModeSwitch = (checked: boolean) => {
        updateUser({settings: {...settings, weightedMode: checked}}, user.id)
            .then(() => {
                setSettings({...settings, weightedMode: checked});
                setUser({...user, settings: {...settings, weightedMode: checked}})
            })
    }

    if (isLoading){
        return <p>Loading...</p>;
    }
    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="grid justify-start w-3/4">
                {/*Clerk Profile Settings*/}
                <div className="flex items-center mb-4 gap-4 ">
                    <h2 className="text-xl font-semibold">Profile Settings: </h2>
                    <UserButton afterSignOutUrl='sign-in'></UserButton>
                </div>
                {/*Dark Mode*/}
                <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={(e) => handleDarkModeSwitch(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 font-semibold">Dark Mode</span>
                    </label>
                </div>
                {/*Weighted Mode*/}
                <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.weightedMode}
                            onChange={(e) => handleWeightedModeSwitch(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 font-semibold">Weighted Mode:</span>
                    </label>
                    <p>If weighted mode is on, when the tunings of an instrument are averaged, how often a string is tuned
                        to a note is taken into account. Otherwise it is not. For example, say you have a guitar with
                        E Standard, Drop D, and E-Flat standard. In weighted mode, the 5th string would be G#2 + 66 cents. If not
                        weighted, the 5th string would be G#2 + 50 cents. </p>
                </div>
                {/*String Weight Offset*/}
                <div>

                </div>
            </div>

        </div>
    )
}
export default Settings;