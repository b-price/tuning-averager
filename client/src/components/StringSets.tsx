import Modal from "./Modal";
import { StringSet, Instrument } from "../../types.ts";
import React, { useState } from "react";
import {getBouts, getPW} from "../utils/calculate.ts";
import DeleteConfirm from "./DeleteConfirm.tsx";
import StringInfoDisplay from "./StringInfoDisplay.tsx";

interface StringSetsProps {
    instrument: Instrument;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (stringSet: StringSet) => void;
    onEdit: (stringSet: StringSet) => void;
    reversed?: boolean;
}

const StringSets: React.FC<StringSetsProps> = ({
    instrument,
    isOpen,
    onClose,
    onDelete,
    onEdit,
    reversed = false,
}) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<StringSet | null>(null);

    if (!instrument || !instrument.stringSets) {
        return null;
    }

    const onDeleteClick = (stringSet: StringSet) => {
        setSetToDelete(stringSet);
        setIsDeleteConfirmOpen(true);
    };

    const onDeleteConfirm = () => {
        if (setToDelete) {
            onDelete(setToDelete);
        }
        setIsDeleteConfirmOpen(false);
    };

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex-col px-8 pb-6 mx-auto">
                    <h2 className="text-2xl font-bold mb-2 mt-0">
                        String Sets
                    </h2>
                    {instrument ? (
                        <h3 className="text-md font-semibold mb-4">
                            for {instrument.name}
                        </h3>
                    ) : (
                        <></>
                    )}

                    <div className="flex flex-col h-full justify-self-center">
                        <table className="table-auto min-w-max border border-separate border-slate-700 dark:border-white rounded-lg bg-gray-100 dark:bg-gray-900">
                            {instrument.stringSets.map((set, index) => (
                                <tbody key={set.name + index} className="">
                                    {/*Name, Edit/Delete*/}
                                    <tr key={set.name + index} className="">
                                        <td
                                            className={
                                                `flex items-center justify-evenly pt-2 ${index !== 0 && "border-t border-slate-700 dark:border-white"}`
                                            }
                                        >
                                            <div>
                                                <strong>
                                                    {set.name}
                                                    {set.favorite && " ★"}
                                                </strong>
                                            </div>
                                            <button
                                                className="bg-gray-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2"
                                                onClick={() => onEdit(set)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2"
                                                onClick={() =>
                                                    onDeleteClick(set)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    {/*String Gauges*/}
                                    <tr className="mb-3">
                                        <td className="flex justify-items-center">
                                            <StringInfoDisplay
                                                info={set.gauges.map(
                                                    (g, i) =>
                                                        `${g}${getPW(g, set.woundStrings[i])}`,
                                                )}
                                                bouts={getBouts(
                                                    instrument.strings,
                                                    instrument.type,
                                                )}
                                                textStyle="font-semibold"
                                                reversed={reversed}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                    <DeleteConfirm
                        onClose={() => setIsDeleteConfirmOpen(false)}
                        isOpen={isDeleteConfirmOpen}
                        deleteFunction={onDeleteConfirm}
                    />
                </div>
            </Modal>
        </div>
    );
};
export default StringSets;
