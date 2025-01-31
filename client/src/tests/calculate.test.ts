import { Tuning } from "../../types.ts";
import {
    stringAverage,
    getFrequency,
    stringGauge,
    getUnitWeight,
    convertToNote,
    tension,
    uwFromGauge,
    round,
    capitalize,
    formatMaterial,
    getPlain,
    coeffPower,
    getPW,
    getMultiscale, stringAverageUnweighted,
} from "../utils/calculate";
import {MAX_STRING_GAUGE, MIN_STRING_GAUGE, PLAIN_CHAR, WOUND_CHAR, WOUND_OVERLAP} from "../defaults.ts";

const testTunings: Tuning[] = [
    {
        id: '0',
        name: 'E Standard',
        strings: [
            { note: 'E4', noteValue: 52 },
            { note: 'B3', noteValue: 47 },
            { note: 'G3', noteValue: 43 },
            { note: 'D3', noteValue: 38 },
            { note: 'A2', noteValue: 33 },
            { note: 'E2', noteValue: 28 },
        ],
        type: 'guitar',
    },
    {
        id: '1',
        name: 'D Standard',
        strings: [
            { note: 'D4', noteValue: 50 },
            { note: 'A3', noteValue: 45 },
            { note: 'F3', noteValue: 41 },
            { note: 'C3', noteValue: 36 },
            { note: 'G2', noteValue: 31 },
            { note: 'D2', noteValue: 26 },
        ],
        type: 'guitar',
    },
    {
        id: '2',
        name: 'D Standard Bass',
        strings: [
            { note: 'F2', noteValue: 29 },
            { note: 'C2', noteValue: 24 },
            { note: 'G1', noteValue: 19 },
            { note: 'D1', noteValue: 14 },
        ],
        type: 'bass',
    },
    {
        id: '3',
        name: 'D Standard Bass 5',
        strings: [
            { note: 'F2', noteValue: 29 },
            { note: 'C2', noteValue: 24 },
            { note: 'G1', noteValue: 19 },
            { note: 'D1', noteValue: 14 },
            { note: 'A0', noteValue: 9 },
        ],
        type: 'bass',
    },
    {
        id: '4',
        name: 'D Standard',
        strings: [
            { note: 'D4', noteValue: 50 },
            { note: 'A3', noteValue: 45 },
            { note: 'F3', noteValue: 41 },
            { note: 'C3', noteValue: 36 },
            { note: 'G2', noteValue: 31 },
            { note: 'D2', noteValue: 26 },
        ],
        type: 'bass',
    },
    {
        id: '5',
        name: 'Drop D',
        strings: [
            { note: 'E4', noteValue: 52 },
            { note: 'B3', noteValue: 47 },
            { note: 'G3', noteValue: 43 },
            { note: 'D3', noteValue: 38 },
            { note: 'A2', noteValue: 33 },
            { note: 'D2', noteValue: 26 },
        ],
        type: 'guitar',
    },
    {
        id: 'bad1',
        name: 'Bad1',
        strings: [
            { note: 'D', noteValue: 50 },
            { note: 'A-1', noteValue: 200 },
            { note: 'foo', noteValue: 41 },
            { note: 'C3', noteValue: -2 },
            { note: 'G2', noteValue: 31 },
            { note: 'D20', noteValue: 26 },
        ],
        type: 'other',
    },
    {
        id: 'bad2',
        name: 'Bad2',
        strings: [

        ],
        type: 'other',
    },

]

describe('App Calculation Functions', () => {

    describe('stringAverage', () => {
        it('should return the average note values for each string across tunings', () => {
            expect(stringAverage(testTunings.slice(0, 2))).toEqual([51, 46, 42, 37, 32, 27])
            expect(stringAverage([testTunings[0], testTunings[0]])).toEqual([52, 47, 43, 38, 33, 28])
        });

        it('should return null if tunings do not have the same number of strings', () => {
            expect(stringAverage([testTunings[0], testTunings[2]])).toBeUndefined();
        });

        it('should return null if tunings are for different instruments', () => {
            expect(stringAverage([testTunings[1], testTunings[4]])).toBeUndefined();
        });
    });

    describe('stringAverageUnweighted', () => {
        it('should return the average note values for each string across tunings, unweighted for occurrence', () => {
            expect(stringAverageUnweighted(testTunings.slice(0, 2))).toEqual([51, 46, 42, 37, 32, 27]);
            expect(stringAverageUnweighted([testTunings[0], testTunings[0]])).toEqual([52, 47, 43, 38, 33, 28])
            expect(stringAverageUnweighted([testTunings[0], testTunings[1], testTunings[5]])).toEqual([51, 46, 42, 37, 32, 27])
        });

        it('should return null if tunings do not have the same number of strings', () => {
            expect(stringAverageUnweighted([testTunings[0], testTunings[2]])).toBeUndefined();
        });

        it('should return null if tunings are for different instruments', () => {
            expect(stringAverage([testTunings[1], testTunings[4]])).toBeUndefined();
        });
    });

    describe('convertToNote', () => {
        it('should convert a note value to a note object', () => {
            expect(convertToNote(0)).toStrictEqual({ note: 'C0', cents: 0, noteValue: 0})
            expect(convertToNote(27)).toStrictEqual({ note: 'D#2', cents: 0, noteValue: 27})
            expect(convertToNote(1.5)).toStrictEqual({ note: 'C#0', cents: 50, noteValue: 1.5})
        })
        it('should return an invalid note if the note value is invalid', () => {
            expect(convertToNote(-1)).toStrictEqual({ note: 'invalid', cents: 0, noteValue: -1})
            expect(convertToNote(900)).toStrictEqual({ note: 'invalid', cents: 0, noteValue: 900})
        })
    })

    describe('getFrequency', () => {
        it('should return the frequency for each note', () => {
            expect(getFrequency(57)).toBe(440)
            expect(getFrequency(69)).toBe(880)
            expect(getFrequency(0)).toBeCloseTo(16.352)
        })
        it('returns a default frequency for note value 0', () => {
            expect(getFrequency(0)).toBeCloseTo(16.3516, 4);
        });

        it('should return the frequency if a non-standard reference pitch is passed', () => {
            expect(getFrequency(57, 400)).toBe(400)
        })

        it('returns 0 for negative note values', () => {
            expect(getFrequency(-1)).toBe(0);
        });

        it('returns 0 for negative reference pitch', () => {
            expect(getFrequency(55, -1)).toBe(0);
        });
    })

    describe('getUnitWeight', () => {
        it('calculates unit weight correctly for valid inputs', () => {
            expect(getUnitWeight(57, 25.5, 16)).toBeCloseTo(0.0000122775410602, 12);
        });

        it('returns 0 for invalid note values', () => {
            expect(getUnitWeight(-1, 24, 19)).toBe(0);
        });

        it('returns 0 for invalid scale values', () => {
            expect(getUnitWeight(50, -4, 19)).toBe(0);
        });

        it('returns 0 for invalid tension values', () => {
            expect(getUnitWeight(50, 24, -19)).toBe(0);
        });
    });

    describe('stringGauge', () => {
        it('calculates string gauge correctly', () => {
            expect(stringGauge(0.001, 1, 2)).toBe(100);
            expect(stringGauge(0.00001, 2.89, 1.5)).toBeCloseTo(10.5, 1);
        });

        it('returns min gauge for too low UWs', () => {
            expect(stringGauge(-1, 30, 20)).toBe(MIN_STRING_GAUGE);
            expect(stringGauge(0, 30, 20)).toBe(MIN_STRING_GAUGE);
        });

        it('returns min gauge when gauge is too low', () => {
            expect(stringGauge(0.00001, 6, 8)).toBe(MIN_STRING_GAUGE);
        });
        it('returns max gauge when gauge is too high', () => {
            expect(stringGauge(1, 1, 2)).toBe(MAX_STRING_GAUGE);
        });

        it('handles coefficients of 0', () => {
            expect(stringGauge(0.0001, 0, 2)).toBe(100);
        });
    });

    describe('tension', () => {
        it('calculates tension correctly for valid inputs', () => {
            expect(tension(0.0001, 45, 25.5)).toBeCloseTo(32.57981, 5);
        })
        it('returns 0 for invalid UWs', () => {
            expect(tension(0, 45, 25.5)).toBe(0);
        })
        it('returns 0 for invalid note values', () => {
            expect(tension(0.001, -8, 25.5)).toBe(0);
        })
        it('returns 0 for invalid scale lengths', () => {
            expect(tension(0.001, 45, 0)).toBe(0);
        })
    })

    describe('uwFromGauge', () => {
        it('calculates unit weight correctly', () => {
            expect(uwFromGauge(100, 2, 2)).toBeCloseTo(0.002, 4);
            expect(uwFromGauge(50, 1.4, 2)).toBeCloseTo(0.00035, 6);
        })
    })

    describe('round', () => {
        it('rounds num to precision', ()=> {
            expect(round(1, 2)).toBe(1);
            expect(round(1.005167, 3)).toBeCloseTo(1.005, 5);
        })
    })

    describe('capitalize', () => {
        it('capitalizes a word', () => {
            expect(capitalize('guitar')).toBe('Guitar');
            expect(capitalize('gUiTaR')).toBe('Guitar');
            expect(capitalize('Guitar')).toBe('Guitar');
        })
    })

    describe('formatMaterial', () => {
        it('formats string material', () => {
            expect(formatMaterial('GHS_guitar_Boomers')).toBe('GHS Boomers');
            expect(formatMaterial('GHS_plain')).toBe('GHS_plain');
            expect(formatMaterial('GHS_888_n')).toBe('GHS_888_n');
        })
    })

    describe('getPlain', () => {
        it('returns correct plain string', () => {
            expect(getPlain('GHS_guitar_Boomers')).toBe('GHS_plain');
        })
        it('returns correct plain string with alt plain', () => {
            expect(getPlain('Daddario_guitar_ClassicSilverplated')).toBe('Daddario_plain_ClearNylon');
        })
        it('returns correct plain string if kalium', () => {
            expect(getPlain('Kalium')).toBe('Kalium');
        })
        it('returns string_plain if no separator', () => {
            expect(getPlain('String')).toBe('String_plain');
        })
    })

    describe('coeffPower', () => {
        it('returns correct coefficient and power object', () => {
            expect(coeffPower('GHS_guitar_Boomers', true)).toStrictEqual({coeff: 2.1627709, power: 1.97673144});
            expect(coeffPower('GHS_guitar_Boomers', false)).toStrictEqual({coeff: 2.03170652, power: 2.04187443});
        })
        it('returns guitar Daddario XL (default) when material does not exist', () => {
            expect(coeffPower('kldflksf', false)).toStrictEqual({coeff: 2.03048974, power: 1.97385195});
        })
    })

    describe('getPW', () => {
        it('returns wound character', () => {
            expect(getPW(WOUND_OVERLAP[0], true)).toBe(WOUND_CHAR);
            expect(getPW(WOUND_OVERLAP[1], true)).toBe(WOUND_CHAR);
        })
        it('returns plain character', () => {
            expect(getPW(WOUND_OVERLAP[0], false)).toBe(PLAIN_CHAR);
            expect(getPW(WOUND_OVERLAP[1], false)).toBe(PLAIN_CHAR);
        })
        it('returns empty string', () => {
            expect(getPW(WOUND_OVERLAP[0] - 2, false)).toBe('');
            expect(getPW(WOUND_OVERLAP[1] + 2, false)).toBe('');
            expect(getPW(WOUND_OVERLAP[0] - 2, true)).toBe('');
            expect(getPW(WOUND_OVERLAP[1] + 2, true)).toBe('');
        })
    })

    describe('getMultiscale', () => {
        it('returns correct multiscale', () => {
            expect(getMultiscale(24, 3, 2)).toStrictEqual([24, 25, 26]);
        })
        it('returns scale if 1 string', () => {
            expect(getMultiscale(24, 1, 2)).toStrictEqual([24]);
        })
    })

});