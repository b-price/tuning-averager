import React, {ReactNode} from "react";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    twStyle?: string;
    disabled?: boolean;
    children: ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, twStyle, disabled, children }) => {
    const twClass = twStyle ? twStyle : "flex items-center mt-4";
    return (
        <div className={twClass}>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                    disabled={disabled}
                />
                <div
                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                {children}
            </label>
        </div>
    )
}
export default ToggleSwitch;