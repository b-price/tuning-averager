import {ExportSelection, Instrument, Tuning} from "../../../types.ts";
import React, { useState } from "react";
import Modal from "./Modal.tsx";
import { useMessage } from "../hooks/useMessage.ts";
import Alert from "./Alert.tsx";
import { CSVLink } from "react-csv";
import ToggleSwitch from "./ToggleSwitch.tsx";
import {EXPORT_TEXT, PLAIN_CHAR} from "../defaults.ts";
import {formatMaterial} from "../utils/calculate.ts";

interface ExportDataProps {
    tunings: Tuning[];
    instruments: Instrument[];
    isOpen: boolean;
    onClose: () => void;
}

const ExportData: React.FC<ExportDataProps> = ({ tunings, instruments, isOpen, onClose }) => {
    const [dataSelection, setDataSelection] = useState<ExportSelection>("Instruments");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const { message, messageType, showMessage, show, closeMessage } = useMessage();

    const getCSVData = () => {
        switch (dataSelection) {
            case "Instruments":
                return {
                    headers: [
                        { label: "Name", key: "name" },
                        { label: "Type", key: "type" },
                        { label: "Strings", key: "strings" },
                        { label: "Scale", key: "scale" },
                        { label: "Tunings", key: "tunings" },
                        { label: "Target Tension", key: "tensions" },
                        { label: "String Sets", key: "stringSets" },
                    ],
                    data: instruments.map(inst => ({
                        name: inst.name,
                        type: inst.type,
                        strings: inst.strings,
                        scale: inst.isMultiscale && inst.scales ? inst.scales.join(", ") : inst.scale,
                        tunings: inst.tunings.map(t => t.name).join(", "),
                        tensions: inst.targetTension.join(", "),
                        stringSets: inst.stringSets.map(s => s.name).join(", "),
                    })),
                    filename: 'instruments.csv'
                };
            case "Tunings":
                return {
                    headers: [
                        { label: "Name", key: "name" },
                        { label: "Type", key: "type" },
                        { label: "Strings", key: "strings" },
                    ],
                    data: tunings.map(tuning => ({
                        name: tuning.name,
                        type: tuning.type,
                        strings: tuning.strings.map(s => s.note).join(", "),
                    })),
                    filename: 'tunings.csv'
                };
            case "StringSets":
                return {
                    headers: [
                        { label: "Instrument", key: "instrument" },
                        { label: "Name", key: "name" },
                        { label: "Gauges", key: "gauges" },
                        { label: "Material", key: "material" },
                    ],
                    data: instruments.flatMap(instrument =>
                        instrument.stringSets.map(strSet => ({
                            instrument: instrument.name,
                            name: strSet.name,
                            gauges: strSet.gauges.map((g, idx) => !strSet.woundStrings[idx] ? `${g}${PLAIN_CHAR}` : g).join(", "),
                            material: strSet.stringMaterial ? formatMaterial(strSet.stringMaterial) : "",
                            favorite: strSet.favorite,
                        })).filter(strSet => onlyFavorites ? strSet.favorite : strSet)
                    ),
                    filename: 'string_sets.csv'
                };
            case "Strings":
                {
                    const allGauges = instruments.flatMap(instrument =>
                    instrument.stringSets.filter(s => onlyFavorites ? s.favorite : s).flatMap(strSet => strSet.gauges)
                    );

                    const gaugeCounts = allGauges.reduce((acc, gauge) => {
                        acc[gauge] = (acc[gauge] || 0) + 1;
                        return acc;
                    }, {} as { [key: number]: number });

                    const gaugeData = Object.entries(gaugeCounts)
                        .map(([gauge, count]) => ({
                            gauge: parseFloat(gauge), // Convert key back to number
                            count: count
                        }))
                        .sort((a, b) => a.gauge - b.gauge); // Sort by gauge numerically

                    return {
                        headers: [
                            { label: "Gauge", key: "gauge" },
                            { label: "Count", key: "count" },
                        ],
                        data: gaugeData,
                        filename: 'strings.csv'
                    };
                }
            default:
                return { headers: [], data: [], filename: 'data.csv' };
        }
    };

    const { headers, data, filename } = getCSVData();

    const onButtonClick = () => {
        showMessage('CSV Downloaded!', 'success');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex-col mx-auto sm:px-8 px-4 pb-6 rounded-xl md:max-w-xl">
                <h2 className="text-2xl font-bold mb-2 mt-0">Export Data</h2>
                <div>
                    <label className="block text-sm font-medium">Data to Export</label>
                    <select
                        value={dataSelection}
                        onChange={(e) => setDataSelection(e.target.value as ExportSelection)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="Instruments">Instruments</option>
                        <option value="Tunings">Tunings</option>
                        <option value="StringSets">String Sets</option>
                        <option value="Strings">Strings</option>
                        {/*<option value="All">All</option>*/}
                    </select>
                    <div className={`justify-items-center transition-all duration-300 ease-in-out ${dataSelection !== "Instruments" && dataSelection !== "Tunings" ? "opacity-100" : "opacity-0 h-0 invisible" }`}>
                        <ToggleSwitch checked={onlyFavorites} onChange={(e) => setOnlyFavorites(e.target.checked)}>
                            <span className="ml-3 text-sm font-medium">Use Only Favorite String Sets</span>
                        </ToggleSwitch>
                    </div>
                    <div className="my-6">
                        <CSVLink
                            data={data}
                            headers={headers}
                            filename={filename}
                            onClick={onButtonClick}
                            className="w-full bg-indigo-500 text-white m-2 px-4 py-2 rounded-md hover:bg-indigo-400 hover:text-white focus:outline-none focus:ring-2"
                        >
                            Download CSV
                        </CSVLink>
                    </div>
                    <div className="">
                        <p className="text-sm">{EXPORT_TEXT[dataSelection]}</p>
                    </div>
                </div>
                <Alert show={show} message={message} type={messageType} onClose={closeMessage} style="mt-6 mb-4 justify-center"/>
            </div>
        </Modal>
    );
};

export default ExportData;