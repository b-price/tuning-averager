import { Tuning } from "../../../types.ts";
import {
    tuningWeight,
    stringAverage,
    convertToNoteValue,
    getFrequency,
    stringGauge,
    getUnitWeight,
} from "../utils/calculate";
import {presetTunings} from "../defaults";

describe('Tuning Functions', () => {

    describe('tuningWeight', () => {
        it('should calculate the average note value of a tuning', () => {
            const testTuning: Tuning = {
                name: 'standard',
                strings: [
                    { note: 'E 2', noteValue: 9 },
                    { note: 'B 2', noteValue: 7 },
                    { note: 'G 2', noteValue: 5 },
                    { note: 'D 2', noteValue: 4 },
                    { note: 'A 2', noteValue: 3 },
                    { note: 'E 2', noteValue: 8 },
                ],
                type: "guitar"
            };
            expect(tuningWeight(testTuning)).toBe(6);
        });
    });

    describe('stringAverage', () => {
        it('should return the average note values for each string across tunings', () => {
            // const testTunings: Tuning[] = [
            //     {
            //         name: 'standard',
            //         strings: [
            //             { note: 'E 2', noteValue: 8 },
            //             { note: 'B 2', noteValue: 7 },
            //             { note: 'G 2', noteValue: 5 },
            //             { note: 'D 2', noteValue: 4 },
            //             { note: 'A 2', noteValue: 3 },
            //             { note: 'E 2', noteValue: 8 },
            //         ],
            //         type: "guitar"
            //     },
            //     {
            //         name: 'alternative',
            //         strings: [
            //             { note: 'E 3', noteValue: 9 },
            //             { note: 'B 3', noteValue: 8 },
            //             { note: 'G 3', noteValue: 6 },
            //             { note: 'D 3', noteValue: 5 },
            //             { note: 'A 3', noteValue: 4 },
            //             { note: 'E 3', noteValue: 9 },
            //         ],
            //         type: "guitar"
            //     }
            // ];
            expect(stringAverage(presetTunings.slice(0, 2))).toEqual([51, 46, 43, 38, 33, 27]);
            expect(stringAverage([presetTunings[0], presetTunings[0]])).toEqual([52, 47, 43, 38, 33, 28])
        });

        it('should return null if tunings do not have the same number of strings', () => {
            const testTunings: Tuning[] = [
                {
                    name: 'standard',
                    strings: [
                        { note: 'E 2', noteValue: 8 },
                        { note: 'B 2', noteValue: 7 },
                        { note: 'G 2', noteValue: 5 },
                        { note: 'D 2', noteValue: 4 },
                        { note: 'A 2', noteValue: 3 },
                        { note: 'E 2', noteValue: 8 },
                    ],
                    type: "guitar"
                },
                {
                    name: 'alternative',
                    strings: [
                        { note: 'E 3', noteValue: 9 },
                        { note: 'B 3', noteValue: 8 },
                        { note: 'G 3', noteValue: 6 },
                        { note: 'D 3', noteValue: 5 },
                        { note: 'A 3', noteValue: 4 },
                    ],
                    type: "other"
                }
            ];
            expect(stringAverage(testTunings)).toBeNull();
        });
    });

    describe('convertToNoteValue', () => {
        it('should convert a note to its corresponding note value', () => {
            expect(convertToNoteValue('C 0')).toBe(0);
            expect(convertToNoteValue('D#2')).toBe(26);
            expect(convertToNoteValue('E 0')).toBe(4);
        });

        it('should return 0 for invalid note formats', () => {
            expect(convertToNoteValue('C')).toBe(0);
            expect(convertToNoteValue('D33')).toBe(0);
            expect(convertToNoteValue('q 3')).toBe(0);
        });
    });
    describe('getFrequency', () => {
        it('should return the frequency for each note', () => {
            expect(getFrequency(57)).toBe(440)
            expect(getFrequency(69)).toBe(880)
            expect(getFrequency(0)).toBeCloseTo(16.352)
        })
    })
    describe('getFrequency', () => {
        it('calculates frequency correctly for positive note values', () => {
            expect(getFrequency(57)).toBeCloseTo(440, 1);
            expect(getFrequency(28)).toBeCloseTo(82.4069, 4);
        });

        it('returns a default frequency for note value 0', () => {
            expect(getFrequency(0)).toBeCloseTo(16.3516, 4);
        });

        it('returns 0 for negative note values', () => {
            expect(getFrequency(-1)).toBe(0);
        });
    });

    describe('getUnitWeight', () => {
        it('calculates unit weight correctly for valid inputs', () => {
            expect(getUnitWeight(57, 25.5, 16)).toBeCloseTo(0.0000122775410602, 12);
        });

        it('returns 0 for invalid note values', () => {
            expect(getUnitWeight(-1, 24, 19)).toBe(0);
        });
    });

    describe('stringGauge', () => {
        it('calculates string gauge correctly for different instrument and winding types', () => {
            //expect(stringGauge(28, 25.5, 17.5, 'guitar', true)).toBeCloseTo(45.24158, 1);
            //expect(stringGauge(47, 25.5, 15.4, 'guitar', false)).toBeCloseTo(13.91449, 5);
            expect(stringGauge(16, 34, 32, 'bass', true)).toBeCloseTo(127.58495, 5);
        });

        it('returns 0 for invalid note values', () => {
            expect(stringGauge(-1, 30, 20, 'guitar', true)).toBe(0);
        });
    });

});