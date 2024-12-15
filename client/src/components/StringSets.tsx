import Modal from './Modal';
import {StringSet, Instrument} from '../../../types.ts';
import React from "react";

interface StringSetsProps {
    instrument: Instrument;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (stringSet: StringSet) => void;
    onEdit: (stringSet: StringSet) => void;
}

const StringSets: React.FC<StringSetsProps> = ({ instrument, isOpen, onClose, onDelete, onEdit }) => {
    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex-col px-8 pb-6 mx-auto">
                    <h2 className="text-2xl font-bold mb-2 mt-0">String Sets</h2>
                    {instrument ? <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3> : <></>}

                    <div className="flex flex-col h-full justify-self-center">
                        <table className="text-left table-auto min-w-max bg-gray-800">
                            <tbody>
                                {instrument.stringSets.map((set, index) => (
                                    <>
                                        <tr key={set.name + index} className="border-x border-t">
                                            <td className="p-2" colSpan={set.gauges.length / 3}><strong>{set.name}</strong></td>
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
                                                    onClick={() => (onDelete(set))}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-700 border-x border-b mb-3">
                                            {set.gauges.map((gauge, index) => (
                                                <td key={index}
                                                    className="p-2">{gauge}{set.woundStrings[index] ? "w" : "p"}</td>
                                            ))}
                                        </tr>
                                    </>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default StringSets;