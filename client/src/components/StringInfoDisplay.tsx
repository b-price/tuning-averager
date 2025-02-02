import React from "react";
import {round} from "../utils/calculate.ts";
import {DECIMAL_POINTS} from "../defaults.ts";

interface StringInfoDisplayProps {
    info: string[] | number[];
    bouts?: number;
    textStyle?: string;
    reversed?: boolean;
}

const StringInfoDisplay: React.FC<StringInfoDisplayProps> = ({
    info,
    bouts = 1,
    textStyle,
    reversed = false,
}) => {
    const boutsMap =
        Array.from({ length: bouts }, (_v, i) => {
            const bout = info
                .map((inf, index) => ({ info: inf, string: index + 1 }))
                .filter((_info, idx) => idx % bouts === i)
            return reversed ? bout : bout.reverse();
          });

    return (
        <div>
            <table className="table-auto min-w-max border-separate border-spacing-1">
                <tbody>
                    {boutsMap.map((bout, i) => (
                        <tr className="" key={i}>
                            {bout.map((data, idx) => (
                                <td
                                    key={idx}
                                    className={`px-3 py-2 rounded-lg ${idx % 2 !== 0 ? "bg-gray-300 dark:bg-gray-700" : "dark:bg-gray-800 bg-gray-200"}`}
                                >
                                    <div className="flex items-center justify-center">
                                        <p className={`z-[1] relative ${textStyle}`}>
                                            {typeof data.info === 'number' ? round(data.info, DECIMAL_POINTS) : data.info}
                                        </p>
                                        <p className="z-0 font-bold text-center text-4xl text-gray-100 dark:text-gray-600 absolute self-center">
                                            {data.string}
                                        </p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StringInfoDisplay;