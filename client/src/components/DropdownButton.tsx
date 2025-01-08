import React, {useEffect, ReactNode, useRef, useState} from "react";

interface DropdownButtonProps {
    children: ReactNode;
    id: string;
    buttonText: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ children, id, buttonText }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (event.target && (event.target as HTMLElement).id !== id){
                    setIsDropdownOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative">
            <button
                id={id}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-400"
            >
                {buttonText}
            </button>


            <div ref={dropdownRef}
                 className={isDropdownOpen
                     ? "mt-2 py-2 w-full dark:bg-gray-500 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-500 ease-in-out max-h-screen"
                     : "z-10 overflow-hidden transition-all duration-500 ease-in-out max-h-0"}
            >
                {children}
            </div>

        </div>
    )
}

export default DropdownButton;