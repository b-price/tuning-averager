import React from "react";
import {UserButton} from '@clerk/clerk-react';

const Settings: React.FC = () => {

    return (
        <div className="settings">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="flex items-center mb-4 gap-4 justify-center">
                <h2 className="text-xl font-semibold">Profile Settings: </h2>
                <UserButton afterSignOutUrl='sign-in'></UserButton>

            </div>
        </div>
    )
}
export default Settings;