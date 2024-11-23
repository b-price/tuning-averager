import React, {useEffect, useState} from "react";
import {UserData} from "../../../types.ts";
import {defaultUser} from "../defaults.ts";
import Home from "./Home.tsx";
import {getUser} from "../utils/serverFunctions.ts";


const TARouter: React.FC = () => {
    const username = "atg666"
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getUser(username)
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