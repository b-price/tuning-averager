import Modal from './Modal';
import {Tuning, StringSet, Instrument} from '../../../types.ts';
import React from "react";

interface StringSetsProps {
    instrument: Instrument;
    isOpen: boolean;
    onClose: () => void;
}

const StringSets: React.FC<StringSetsProps> = ({ instrument, isOpen, onClose }) => {
    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex-col px-8 pb-6 mx-auto bg-gray-600 rounded-xl">
                    <h2 className="text-2xl font-bold mb-2 mt-0">String Sets</h2>
                    {instrument ? <h3 className="text-md font-semibold mb-4">for {instrument.name}</h3> : <></>}

                    <div>
                        <table className="border">
                            <tbody>
                                {instrument.stringSets.map(set => (
                                    <tr key={set.name}>
                                        <td className="border">{set.name}</td>
                                        {set.gauges.map((gauge, index) => (
                                            <td key={index} className="border">{gauge}{set.woundStrings[index]}</td>
                                        ))}
                                    </tr>
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