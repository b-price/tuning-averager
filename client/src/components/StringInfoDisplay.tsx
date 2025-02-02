import React from "react";
import {round} from "../utils/calculate.ts";
import {StringDisplayColors} from "../../types.ts";

interface StringInfoDisplayProps {
    info: string[] | number[];
    bouts?: number;
    textStyle?: string;
    reversed?: boolean;
    alternated?: boolean;
    colors?: StringDisplayColors;
}

const StringInfoDisplay: React.FC<StringInfoDisplayProps> = ({
    info,
    bouts = 1,
    textStyle,
    reversed = false,
    alternated = true,
    colors = {
        bgLight: "bg-gray-300",
        bgDark: "dark:bg-gray-700",
        bgLightAlt: `bg-gray-200`,
        bgDarkAlt: `dark:bg-gray-800`,
        textLight: `text-gray-100`,
        textDark: `dark:text-gray-600`,
    },
}) => {
    const boutsMap =
        Array.from({ length: bouts }, (_v, i) => {
            const bout = info
                .map((inf, index) => ({ info: inf, string: index + 1 }))
                .filter((_info, idx) => idx % bouts === i)
            return reversed ? bout : bout.reverse();
          });
    const altNum = alternated ? 2 : 1;

    return (
        <div>
            <table className="table-auto min-w-max border-separate border-spacing-1">
                <tbody>
                    {boutsMap.map((bout, i) => (
                        <tr className="" key={i}>
                            {bout.map((data, idx) => (
                                <td
                                    key={idx}
                                    className={` py-2 rounded-lg ${idx % altNum !== 0 ? `${colors.bgLight} ${colors.bgDark}` : `${colors.bgLightAlt} ${colors.bgDarkAlt}`}`}
                                >
                                    <div className="flex items-center justify-center">
                                        <p
                                            className={`w-11 z-[1] text-center relative ${textStyle}`}
                                        >
                                            {typeof data.info === "number"
                                                ? round(
                                                      data.info,
                                                      1,
                                                  )
                                                : data.info}
                                        </p>
                                        <p
                                            className={`z-0 font-bold text-center text-4xl ${colors.textLight} ${colors.textDark} absolute self-center`}
                                        >
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