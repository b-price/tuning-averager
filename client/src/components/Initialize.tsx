import React, { useEffect, useState } from "react";
import {Instrument, Tuning, UserData} from "../../types.ts";
import {
    defaultUser,
    INITIAL_TUNINGS,
    LOCAL_INSTS_KEY,
    LOCAL_TUNINGS_KEY,
    LOCAL_USERDATA_KEY
} from "../defaults.ts";
import { getUser } from "../utils/serverFunctions.ts";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
import Home from "./Home.tsx";

const Initialize: React.FC = () => {
    const { userId } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();
    const [currentUser, setCurrentUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLocal, setIsLocal] = useState<boolean>(false);
    const [localTunings, setLocalTunings] = useState<Tuning[]>([]);
    const [localInsts, setLocalInsts] = useState<Instrument[]>([]);

    useEffect(() => {
        if (!userId || !isUserLoaded) {
            const localData = localStorage.getItem(LOCAL_USERDATA_KEY);
            const localStorageTunings = localStorage.getItem(LOCAL_TUNINGS_KEY);
            const localStorageInstruments = localStorage.getItem(LOCAL_INSTS_KEY);
            if (localData) {
                setCurrentUser(JSON.parse(localData));
                setLocalTunings(localStorageTunings ? JSON.parse(localStorageTunings) : []);
                setLocalInsts(localStorageInstruments ? JSON.parse(localStorageInstruments) : []);
            } else {
                localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify(defaultUser));
                setCurrentUser(defaultUser);
                localStorage.setItem(LOCAL_TUNINGS_KEY, JSON.stringify(INITIAL_TUNINGS));
                setLocalTunings(INITIAL_TUNINGS);
            }
            setIsLocal(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getUser(userId)
            .then((userData) => {
                if (!userData) {
                    throw new Error("User not found");
                }
                setCurrentUser((prevUser) => ({
                    ...prevUser,
                    ...userData,
                }));
                //localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify(userData));
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setError("Unable to find data for user. Please check your account or try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId, isUserLoaded]);

    useEffect(() => {
        if (user && user.username) {
            setCurrentUser((prevUser) => {
                if (prevUser.username && prevUser.username === user.username) {
                    return prevUser;
                }
                return new UserData(
                    user.username ? user.username : prevUser.username,
                    prevUser.instruments,
                    prevUser.tunings,
                    prevUser.settings,
                    prevUser.instPresets,
                    prevUser.tensionPresets,
                    prevUser.id
                );
            });
        }
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <div className="flex items-center mb-4 gap-4 ">
                    <h1 className="text-xl font-bold">Profile Settings:</h1>
                    <UserButton />
                </div>
            </div>
        );
    }

    return <Home userData={currentUser} localMode={isLocal} localTunings={localTunings} localInstruments={localInsts}/>;
};

export default Initialize;