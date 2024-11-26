import React, {useEffect, useState} from "react";
import {UserData} from "../../../types.ts";
import {defaultUser} from "../defaults.ts";
import Home from "./Home.tsx";
import {getUser} from "../utils/serverFunctions.ts";
import { useAuth } from '@clerk/clerk-react'

const TARouter: React.FC = () => {
    const { userId } = useAuth()
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getUser(userId)
            .then((userData) => setUser(userData))
            .then(() => setIsLoading(false))
            .catch((e) => console.error(e));

    }, [])

    return (
        <>
            {isLoading ? <div>Loading...</div> : <Home userData={user} />}
        </>
    )
}
export default TARouter;