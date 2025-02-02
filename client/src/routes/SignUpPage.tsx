import { SignUp } from "@clerk/clerk-react";
import {
    LOCAL_INSTS_KEY,
    LOCAL_TUNINGS_KEY,
    LOCAL_USERDATA_KEY,
} from "../defaults.ts";

export default function SignUpPage() {
    const userData = localStorage.getItem(LOCAL_USERDATA_KEY);
    const insts = localStorage.getItem(LOCAL_INSTS_KEY);
    const tunings = localStorage.getItem(LOCAL_TUNINGS_KEY);

    if (!userData) {
        console.error("No userData found in localStorage");
        return (
            <div className="flex justify-center">
                <SignUp />
            </div>
        );
    }

    let parsedUserData;
    let parsedInsts;
    let parsedTunings;
    try {
        parsedUserData = JSON.parse(userData);
        parsedInsts = insts ? JSON.parse(insts) : [];
        parsedTunings = tunings ? JSON.parse(tunings) : [];
    } catch (error) {
        console.error("Error parsing userData:", error);
        return (
            <div className="flex justify-center">
                <SignUp />
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <SignUp
                unsafeMetadata={{
                    userData: parsedUserData,
                    tunings: parsedTunings,
                    instruments: parsedInsts,
                }}
            />
        </div>
    );
}
