import './App.css'
import Home from "./components/Home.tsx";
import {useEffect, useState} from "react";
import {Instrument, Tuning, UserData} from "../../types.ts";
import {presetInstruments, presetTunings} from "./defaults.ts";
import axios, {AxiosError} from "axios";

function App() {
    const serverURL = "http://localhost:8080";
    const [user, setUser] = useState<UserData>();
    const [isLoading, setIsLoading] = useState(true);
    const [tunings, setTunings] = useState<Tuning[]>(presetTunings);
    const [instruments, setInstruments] = useState<Instrument[]>(presetInstruments);

    // const getTunings = async () => {
    //     try {
    //         const response = await axios.get(`${serverURL}/tunings/`);
    //         setTunings(response.data);
    //     }
    //     catch (error) {
    //         if (error instanceof AxiosError) {
    //             console.log(error.response);
    //         }
    //     }
    // };
    //
    // const getInstruments = async () => {
    //     try {
    //         const response = await axios.get(`${serverURL}/instruments/`);
    //         setInstruments(response.data);
    //     }
    //     catch (error) {
    //         if (error instanceof AxiosError) {
    //             console.log(error.response);
    //         }
    //     }
    // };
    //
    // useEffect(() => {
    //     getTunings();
    //     getInstruments();
    // }, [])


  return (
      <>
          <Home instruments={instruments} tunings={tunings}/>

      </>
  )
}

export default App
