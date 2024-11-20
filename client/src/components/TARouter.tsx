import React, {useEffect, useState} from "react";
import {Instrument, Tuning, UserData} from "../../../types.ts";
import axios, {AxiosError} from "axios";
import {defaultUser, presetInstruments, presetTunings, serverURL} from "../defaults.ts";
import Home from "./Home.tsx";
import {getInstruments, getTunings, getUser} from "../utils/serverFunctions.ts";


const TARouter: React.FC = () => {
    const username = "atg666"
    const [user, setUser] = useState<UserData>(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [tunings, setTunings] = useState<Tuning[]>(presetTunings);
    const [instruments, setInstruments] = useState<Instrument[]>(presetInstruments);
    const [updateInst, setUpdateInst] = useState<number>(0);
    const [updateTunings, setUpdateTunings] = useState<number>(0);

    const onUpdateInst = () => {setUpdateInst(updateInst + 1);};

    // const getUser = async (username: string) => {
    //     try {
    //         const response = await axios.get(`${serverURL}/users/?field=username&value=${username}`);
    //         setUser(response.data);
    //         console.log("user:",response.data);
    //         return response.data;
    //     }
    //     catch (error) {
    //         if (error instanceof AxiosError) {
    //             console.log(error.response);
    //         }
    //     }
    // };
    //
    // const getTunings = async (userData: UserData) => {
    //     const userTunings = [];
    //
    //     try {
    //         for (const tuning of userData.tunings) {
    //             const response = await axios.get(`${serverURL}/tunings/${tuning}`);
    //             userTunings.push({...response.data, id: response.data._id});
    //         }
    //         setTunings(userTunings);
    //         console.log("tunings: ", userTunings);
    //         const data = {userData: userData, userTunings: userTunings}
    //         return data;
    //     }
    //     catch (error) {
    //         if (error instanceof AxiosError) {
    //             console.log(error.response);
    //         }
    //     }
    // };
    //
    // const getInstruments = async (data: { userData: UserData, userTunings: Tuning[] }) => {
    //     const userInstruments = [];
    //
    //     try {
    //         for (const instrument of data.userData.instruments) {
    //             const response = await axios.get(`${serverURL}/instruments/${instrument}`);
    //             const instTunings = data.userTunings.filter((tuning) => {
    //                 if (response.data.tunings.includes(tuning.id)){
    //                     return true;
    //                 }
    //                 });
    //             userInstruments.push({...response.data, id: response.data._id, tunings: instTunings});
    //         }
    //         setInstruments(userInstruments);
    //         console.log("instruments: ", userInstruments);
    //         return true;
    //     }
    //     catch (error) {
    //         if (error instanceof AxiosError) {
    //             console.log(error.response);
    //         }
    //     }
    // };

    useEffect(() => {

        getUser(username)
            .then((userData) => setUser(userData))
            .then(() => setIsLoading(false))
            .catch((e) => console.error(e));

    }, [])



    // useEffect(() => {
    //     getTunings(user).then().catch(error => console.error(error));
    // }, [updateInst]);
    //
    // useEffect(() => {
    //     setIsLoading(true);
    //     getInstruments({userData: user, userTunings: tunings})
    //         .then((insts) => setInstruments(insts))
    //         .then(() => setIsLoading(false))
    //         .catch(error => console.error(error));
    // }, [updateInst]);

    return (
        <>
            {isLoading ? <div>Loading...</div> : <Home onUpdateInst={onUpdateInst} userData={user} />}

        </>
    )
}
export default TARouter;