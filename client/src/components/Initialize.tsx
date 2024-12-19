import React, { useEffect, useState } from "react";
import { UserData } from "../../../types.ts";
import { defaultUser } from "../defaults.ts";
import { getUser } from "../utils/serverFunctions.ts";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";
import Home from "./Home.tsx";

const Initialize: React.FC = () => {
    const { userId } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser(); // Ensure `useUser` is fully loaded
    const [currentUser, setCurrentUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Track error state

    useEffect(() => {
        // Ensure `userId` is available and `useUser` is loaded before proceeding
        if (!userId || !isUserLoaded) {
            setError("User ID not found or user data is not loaded.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true); // Set loading state
        setError(null); // Reset error state on new load

        // Fetch user data from the server
        getUser(userId)
            .then((userData) => {
                if (!userData) {
                    throw new Error("User not found"); // Trigger error if no user data is returned
                }
                setCurrentUser((prevUser) => ({
                    ...prevUser,
                    ...userData,
                }));
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setError("Unable to find data for user. Please check your account or try again later.");
            })
            .finally(() => {
                setIsLoading(false); // Always stop loading
            });
    }, [userId, isUserLoaded]); // Depend on both `userId` and `isUserLoaded`

    useEffect(() => {
        // Update username if `user` has a valid username
        if (user && user.username) {
            setCurrentUser((prevUser) => {
                // Avoid unnecessary updates if the username is already set
                if (prevUser.username && prevUser.username === user.username) {
                    return prevUser;
                }
                return new UserData(
                    user.username ? user.username : prevUser.username,
                    prevUser.instruments,
                    prevUser.tunings,
                    prevUser.settings,
                    prevUser.instPresets,
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
                    <UserButton afterSignOutUrl='sign-in'/>
                </div>
            </div>
        );
    }

    return <Home userData={currentUser}/>;
};

export default Initialize;