import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../defaults.ts";

interface TopBarProps {
    loggedIn: boolean;
    linkURL?: string;
}

const TopBar: React.FC<TopBarProps> = ({ linkURL }) => {
    return (
        <div className="flex items-center justify-between mt-4 mx-6">
            <Link to="/">
                <h1 className="text-4xl">
                    {APP_NAME}
                </h1>
            </Link>

            {linkURL ? (
                <Link
                    to={linkURL}
                    className=""
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 21 22"
                        className="size-16 fill-current"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            ) : (
                <div />
            )}
        </div>
    );
};

export default TopBar;
