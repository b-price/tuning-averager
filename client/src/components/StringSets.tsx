import Modal from './Modal';
import {StringSet, Instrument} from '../../types.ts';
import React, {useState} from "react";
import {getPW} from "../utils/calculate.ts";
import DeleteConfirm from "./DeleteConfirm.tsx";

interface StringSetsProps {
    instrument: Instrument;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (stringSet: StringSet) => void;
    onEdit: (stringSet: StringSet) => void;
}

const StringSets: React.FC<StringSetsProps> = ({ instrument, isOpen, onClose, onDelete, onEdit }) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<StringSet | null>(null);

    if (!instrument || !instrument.stringSets) {
        return null;
    }

    const onDeleteClick = (stringSet: StringSet) => {
        setSetToDelete(stringSet);
        setIsDeleteConfirmOpen(true);
    }

    const onDeleteConfirm = () => {
        if (setToDelete) {
            onDelete(setToDelete);
        }
        setIsDeleteConfirmOpen(false);
    }

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex-col px-8 pb-6 mx-auto">
                    <h2 className="text-2xl font-bold mb-2 mt-0">String Sets</h2>
                    {instrument ? <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3> : <></>}

                    <div className="flex flex-col h-full justify-self-center">
                        <table className="text-left table-auto min-w-max dark:bg-gray-800 bg-gray-200">
                            {instrument.stringSets.map((set, index) => (
                                <tbody key={set.name + index}>
                                    {/*Name, Edit/Delete*/}
                                    <tr key={set.name + index} className="border-slate-700 dark:border-white border-x border-t">
                                        <td className="p-2" colSpan={set.gauges.length / 3}><strong>{set.name}{set.favorite && " ★"}</strong></td>
                                        <td className="p-2" colSpan={set.gauges.length / 3}>
                                            <button
                                                className="bg-gray-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                                                onClick={() => (onEdit(set))}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="p-2" colSpan={set.gauges.length / 3}>
                                            <button
                                                className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                                onClick={() => (onDeleteClick(set))}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    {/*String Gauges*/}
                                    {(set.gauges.length < 10 && instrument.type === "guitar") || set.gauges.length < 8 || set.gauges.length === 9?
                                        <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x border-b mb-3">
                                            {set.gauges.map((gauge, index) => (
                                                <td
                                                    key={index}
                                                    className="p-2 font-semibold"
                                                >
                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                </td>
                                            ))}
                                        </tr>
                                        :
                                        // Split the Table for Multi-bout instruments
                                        <>
                                            {/*The case of a 12 string bass lol*/}
                                            {instrument.type === "bass" && set.gauges.length === 12 ?
                                                <>
                                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x mb-3">
                                                        {set.gauges.map((gauge, index) => (
                                                            index % 3 === 0 ?
                                                                <td
                                                                    key={index}
                                                                    className="p-2 font-semibold"
                                                                >
                                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                                </td>
                                                                :
                                                                <></>
                                                        ))}
                                                    </tr>
                                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x mb-3">
                                                        {set.gauges.map((gauge, index) => (
                                                            index % 3 === 1 ?
                                                                <td
                                                                    key={index}
                                                                    className="p-2 font-semibold"
                                                                >
                                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                                </td>
                                                                :
                                                                <></>
                                                        ))}
                                                    </tr>
                                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x border-b mb-3">
                                                        {set.gauges.map((gauge, index) => (
                                                            index % 3 === 2 ?
                                                                <td
                                                                    key={index}
                                                                    className="p-2 font-semibold"
                                                                >
                                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                                </td>
                                                                :
                                                                <></>
                                                        ))}
                                                    </tr>
                                                </>
                                                :
                                                <>
                                                    {/*Other Multi-bout Instruments*/}
                                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x mb-3">
                                                        {set.gauges.map((gauge, index) => (
                                                            index % 2 === 0 ?
                                                                <td
                                                                    key={index}
                                                                    className="p-2 font-semibold"
                                                                >
                                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                                </td>
                                                                :
                                                                <></>
                                                        ))}
                                                    </tr>
                                                    <tr className="hover:bg-gray-300 dark:hover:bg-gray-700 border-slate-700 dark:border-white border-x border-b mb-3">
                                                        {set.gauges.map((gauge, index) => (
                                                            index % 2 === 1 ?
                                                                <td
                                                                    key={index}
                                                                    className="p-2 font-semibold"
                                                                >
                                                                    {gauge}{getPW(gauge, set.woundStrings[index])}
                                                                </td>
                                                                :
                                                                <></>
                                                        ))}
                                                    </tr>
                                                </>
                                            }
                                        </>
                                    }
                                </tbody>
                            ))}
                        </table>
                    </div>
                    <DeleteConfirm onClose={() => setIsDeleteConfirmOpen(false)} isOpen={isDeleteConfirmOpen} deleteFunction={onDeleteConfirm}/>
                </div>

            </Modal>
        </div>
    )
}
export default StringSets;


