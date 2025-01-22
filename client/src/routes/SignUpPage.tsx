import { SignUp } from '@clerk/clerk-react';
import {LOCAL_INSTS_KEY, LOCAL_TUNINGS_KEY, LOCAL_USERDATA_KEY} from "../defaults.ts";

export default function SignUpPage() {
    const userData = localStorage.getItem(LOCAL_USERDATA_KEY);
    const insts = localStorage.getItem(LOCAL_INSTS_KEY);
    const tunings = localStorage.getItem(LOCAL_TUNINGS_KEY);

    // Log the userData to ensure it is being retrieved correctly
    console.log('User Data from Local Storage:', userData);

    // Ensure userData is a valid JSON string
    if (!userData) {
        console.error('No userData found in localStorage');
        return <SignUp />; // Fallback to default SignUp without metadata
    }

    let parsedUserData;
    let parsedInsts;
    let parsedTunings;
    try {
        parsedUserData = JSON.parse(userData);
        parsedInsts = insts ? JSON.parse(insts) : [];
        parsedTunings = tunings ? JSON.parse(tunings) : [];
        console.log('Parsed User Data:', parsedUserData);
        console.log('Insts:', parsedInsts);
        console.log('Tunings:', parsedTunings);
    } catch (error) {
        console.error('Error parsing userData:', error);
        return <SignUp />; // Fallback to default SignUp without metadata
    }

    return <SignUp unsafeMetadata={{ userData: parsedUserData, tunings: parsedTunings, instruments: parsedInsts }} />;
}