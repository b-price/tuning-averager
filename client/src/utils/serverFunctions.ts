import axios, {AxiosError} from "axios";
import {serverURL} from "../defaults";
import {Instrument, Tuning, UserData} from "../../../types";

// user CRUD
export const getUser = async (userID?: string | null) => {
    try {
        if (!userID){
            throw new Error("No user ID");
        }
        const response = await axios.get(`${serverURL}/users/${userID}`);
        return {...response.data, id: response.data._id};
    }
    catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const getUserByUsername = async (username: string) => {
    try {
        const response = await axios.get(`${serverURL}/users/?field=username&value=${username}`);
        return {...response.data, id: response.data._id};
    }
    catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const addUser = async (user: UserData) => {
    try {
        const response = await axios.post(`${serverURL}/users/`, user);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}

export const updateUser = async (changes: object, userID?: string) => {
    try {
        const response = await axios.patch(`${serverURL}/users/${userID}`, changes);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const deleteUser = async (userID: string) => {
    try {
        const response = await axios.delete(`${serverURL}/users/${userID}`);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}

// tunings CRUD
export const getTunings = async (userData?: UserData) => {
    const userTunings = [];

    try {
        if (!userData){
            throw new Error('No user data found.');
        }
        if (!userData.tunings){
            return {userData: userData, userTunings: []};
        }
        for (const tuning of userData.tunings) {
            const response = await axios.get(`${serverURL}/tunings/${tuning}`);
            userTunings.push({...response.data, id: response.data._id});
        }
        const data = {userData: userData, userTunings: userTunings}
        return data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const addTuning = async (tuning: object) => {
    try {
        const response = await axios.post(`${serverURL}/tunings/`, tuning);
        return response.data.id;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}

export const updateTuning = async (changes: object, tuningID?: string) => {
    try {
        const response = await axios.patch(`${serverURL}/tunings/${tuningID}`, changes);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}

export const deleteTuning = async (tuningID?: string) => {
    try {
        if (!tuningID){
            throw new Error('No tuning id found.');
        }
        const response = await axios.delete(`${serverURL}/tunings/${tuningID}`);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}

// instruments CRUD
export const getInstruments = async (data?: { userData: UserData, userTunings: Tuning[] }) => {
    const userInstruments: Instrument[] = [];

    try {
        if (!data) {
            throw new Error('No user data found.');
        }
        if (!data.userData.instruments){
            return userInstruments;
        }
        for (const instrument of data.userData.instruments) {
            const response = await axios.get(`${serverURL}/instruments/${instrument}`);
            const instTunings = data.userTunings.filter((tuning) => {
                if (response.data.tunings.includes(tuning.id)){
                    return true;
                }
            });
            userInstruments.push({...response.data, id: response.data._id, tunings: instTunings});
        }
        return userInstruments;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const updateInstrument = async (changes: object, instID?: string) => {
    try {
        const response = await axios.patch(`${serverURL}/instruments/${instID}`, changes);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const addInstrument = async (instrument: object) => {
    try {
        const response = await axios.post(`${serverURL}/instruments/`, instrument);
        return response.data.id;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
};

export const deleteInstrument = async (instrumentId?: string) => {
    try {
        if (!instrumentId) {
            throw new Error('No instrument id found.');
        }
        const response = await axios.delete(`${serverURL}/instruments/${instrumentId}`);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        }
    }
}




