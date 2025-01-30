import React from "react";
import { Link } from "react-router-dom";
import {APP_NAME} from "../defaults.ts";

interface TopBarProps {
    loggedIn: boolean;
    linkURL?: string;
}

const TopBar: React.FC<TopBarProps> = ({ linkURL }) => {
    return (
        <div className="flex items-center justify-between my-4">
            <Link to="/">
                <h1 className='mx-4 dark:text-gray-200 dark:hover:text-gray-100 text-3xl md:text-4xl'>{APP_NAME}</h1>
            </Link>

            {linkURL ? (
                <Link to={linkURL} className="text-indigo-500 hover:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-16 fill-current">
                        <path fillRule="evenodd"
                              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </Link>
            ) : <div/>}
        </div>
    )
}

export default TopBar;