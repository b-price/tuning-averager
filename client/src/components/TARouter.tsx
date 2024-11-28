import React, {useEffect, useState} from "react";
import {UserData} from "../../../types.ts";
import {defaultUser} from "../defaults.ts";
import Home from "./Home.tsx";
import {getUser} from "../utils/serverFunctions.ts";
import { useAuth, useUser } from '@clerk/clerk-react';

const TARouter: React.FC = () => {
    const { userId } = useAuth();
    const { user } = useUser();
    const [currentUser, setCurrentUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getUser(userId)
            .then((userData) => setCurrentUser(userData))
            .then(() => setIsLoading(false))
            .catch((e) => console.error(e));

    }, []);

    useEffect(() => {
        if (user && user.username){
            setCurrentUser({...currentUser, username: user.username});
        }
    }, [user.username]);

    return (
        <>
            {isLoading ? <div>Loading...</div> : <Home userData={currentUser} />}
        </>
    );
}
export default TARouter;