import {Instrument, InstPreset, Tuning, UserData} from "../../types.ts";

export const APP_NAME = "Ideal Strings"

export const notes = [
    'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
    'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9', 'G#9', 'A9', 'A#9', 'B9'
];

export const REFERENCE_PITCH = 440

export const MAX_STRING_GAUGE = 300
const intStrings = Array.from({length: MAX_STRING_GAUGE + 1 - 13}, (_v, k) => k + 13)
export const STRING_GAUGES = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, ...intStrings]

export const SCALE_LENGTH_RANGE = [10, 100]

export const DEFAULT_TUNING: Tuning = {
    id: '0',
    name: 'E Standard',
    strings: [
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
    ],
    type: 'guitar',
}


export const DEFAULT_INST: Instrument = {
    id: '0',
    name: 'Stratocaster',
    strings: 6,
    tunings: [
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
            id: '2',
            name: 'DADGAD',
            strings: [
                { note: 'D4', noteValue: 50 },
                { note: 'A3', noteValue: 45 },
                { note: 'G3', noteValue: 43 },
                { note: 'D3', noteValue: 38 },
                { note: 'A2', noteValue: 33 },
                { note: 'D2', noteValue: 26 },
            ],
            type: 'guitar',
        },
    ],
    scale: 25.5,
    targetTension: [16.2, 15.4, 16.6, 18.4, 19, 16.9],
    type: 'guitar',
    stringSets: [
        {
            id: '0',
            name: '10-46',
            gauges: [10, 13, 17, 26, 36, 46],
            woundStrings: [false, false, false, true, true, true],
            tensions: [16.2, 15.4, 16.6, 18.4, 19, 16.9],
            noteValues: [28, 33, 38, 43, 47, 53]
        },
    ]
}

export const defaultTunings = {
    guitar: [
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
        { note: 'B1', noteValue: notes.indexOf('B1') },
        { note: 'F#1', noteValue: notes.indexOf('F#1') },
        { note: 'C#1', noteValue: notes.indexOf('C#1') },
        { note: 'G#0', noteValue: notes.indexOf('G#0') },
        { note: 'D#0', noteValue: notes.indexOf('D#0') },
    ],
    guitar_12: [
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'A3', noteValue: notes.indexOf('A3') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
        { note: 'E3', noteValue: notes.indexOf('E3') },
    ],
    guitar_10: [
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
    ],
    guitar_11: [
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'A3', noteValue: notes.indexOf('A3') },
        { note: 'E3', noteValue: notes.indexOf('E3') },
    ],
    bass: [
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'B0', noteValue: notes.indexOf('B0') },
        { note: 'F#0', noteValue: notes.indexOf('F#0') },
        { note: 'C#0', noteValue: notes.indexOf('C#0') },
    ],
    bass_6: [
        { note: 'C3', noteValue: notes.indexOf('C3') },
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'B0', noteValue: notes.indexOf('B0') },
    ],
    bass_7: [
        { note: 'F#3', noteValue: notes.indexOf('F#3') },
        { note: 'C3', noteValue: notes.indexOf('C3') },
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'B0', noteValue: notes.indexOf('B0') },
    ],
    bass_8: [
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
        { note: 'B0', noteValue: notes.indexOf('B0') },
        { note: 'B1', noteValue: notes.indexOf('B1') },
    ],
    bass_9: [
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'F#3', noteValue: notes.indexOf('F#3') },
        { note: 'C3', noteValue: notes.indexOf('C3') },
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'B0', noteValue: notes.indexOf('B0') },
        { note: 'F#0', noteValue: notes.indexOf('F#0') },
        { note: 'C#0', noteValue: notes.indexOf('C#0') },
        { note: 'C#0', noteValue: notes.indexOf('C#0') },
    ],
    bass_12: [
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
    ],
    other: [
        { note: 'A4', noteValue: notes.indexOf('A4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'C4', noteValue: notes.indexOf('C4') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
    ],
    other_ukulele: [
        { note: 'A4', noteValue: notes.indexOf('A4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'C4', noteValue: notes.indexOf('C4') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
    ],
    other_banjo: [
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
    ],
    other_mandolin: [
        { note: 'E5', noteValue: notes.indexOf('E5') },
        { note: 'E5', noteValue: notes.indexOf('E5') },
        { note: 'A4', noteValue: notes.indexOf('A4') },
        { note: 'A4', noteValue: notes.indexOf('A4') },
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'D4', noteValue: notes.indexOf('D4') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'G3', noteValue: notes.indexOf('G3') },
        { note: 'C3', noteValue: notes.indexOf('C3') },
        { note: 'C3', noteValue: notes.indexOf('C3') },
        { note: 'F2', noteValue: notes.indexOf('F2') },
        { note: 'F2', noteValue: notes.indexOf('F2') },
    ],
    other_pedalsteel: [
        { note: 'F#4', noteValue: notes.indexOf('F#4') },
        { note: 'D#4', noteValue: notes.indexOf('D#4') },
        { note: 'G#4', noteValue: notes.indexOf('G#4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'G#3', noteValue: notes.indexOf('G#3') },
        { note: 'F#3', noteValue: notes.indexOf('F#3') },
        { note: 'E3', noteValue: notes.indexOf('E3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'B2', noteValue: notes.indexOf('B2') },
    ],
};

export const STRING_RANGE = [1, 12]
export const VALID_STRINGS = Array.from({length: STRING_RANGE[1] + 1 - STRING_RANGE[0]}, (_v, k) => k + STRING_RANGE[0])

export const woundOverlap = [18, 24]

export const PLAIN_CHAR = 'p'
export const WOUND_CHAR = 'w'

export const stringTypeFactors = {
    guitar: {
        plain: {coeff: 2.215, power: 2},
        wound: {coeff: 2.07, power: 1.97},
    },
    bass: {
        plain: {coeff: 2.215, power: 2},
        wound: {coeff: 2.939, power: 1.89},
    },
    other: {
        plain: {coeff: 2.215, power: 2},
        wound: {coeff: 2.07, power: 1.97},
    },
}

export const serverURL = 'http://localhost:8080';

export const DECIMAL_POINTS = 2

export const defaultSettings = {
    weightedMode: true,
    darkMode: false,
    stringCoeff: 0,
    stringPower: 0,
    useOSTheme: true,
    referencePitch: REFERENCE_PITCH,
}

export const defaultStrings = {
    guitar: 6,
    bass: 4,
    other: 4
}

export const defaultScales = {
    guitar: 25.5,
    bass: 34,
    other: 13
}

export const TENSION_PRESETS_OLD = {
    guitar_2550_E_46: [16.2, 15.4, 16.6, 18.4, 19.0, 16.9],
    guitar_2550_E_42: [13.1, 11.0, 14.7, 15.7, 15.5, 14.4],
    guitar_2550_E_50: [19.6, 17.8, 18.6, 21.1, 21.0, 19.0],
    guitar_2550_E_54: [23.4, 23.3, 22.9, 27.6, 25.6, 23.6],
    guitar_2475_E_46: [15.3, 14.5, 15.6, 17.4, 17.9, 15.9],
    guitar_2475_E_42: [12.4, 10.4, 13.8, 14.8, 14.6, 13.5],
    guitar_2475_E_50: [18.5, 16.8, 17.5, 19.9, 19.7, 17.9],
    guitar_2475_E_54: [22.0, 22.0, 21.6, 26.0, 24.1, 22.2],
    guitar_2400_E_54: [20.7, 20.6, 20.3, 24.5, 22.7, 20.9],
    guitar_2400_E_46: [14.4, 13.6, 14.7, 16.3, 16.9, 15.0],
    bass_3400_E_105: [50.3, 55.6, 45.3, 38.1],
    bass_3400_E_100: [42.5, 48.4, 40.1, 34.7],
    bass5_3400_B_135: [50.3, 55.6, 45.3, 38.1, 35.0],
    bass5_3400_B_130: [42.5, 48.4, 40.1, 34.7, 32.1],
    bass6_3400_BC_130: [39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
    bass_3000_E_105: [39.2, 43.3, 35.3, 29.6],
    bass_3200_E_105: [44.6, 49.3, 40.2, 33.7],
    guitar_3000_E_84: [27.4, 30.0, 30.6, 27.7, 25.6, 19.8],
    banjo_2625_G_11: [16.5, 13.9, 10.3, 14.1, 16.4],
    mandolin_1387_G_36: [23.2, 23.2, 19.3, 19.3, 26.5, 26.5, 20.2, 20.2],
    guitar_3000_G_95: [16.2, 15.4, 17.5, 21.5, 35.0, 38.0]
}

export const INST_PRESETS: InstPreset[] = [
    {
        name: "Guitar 25.5 10-46 E",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tensions: [16.2, 15.4, 16.6, 18.4, 19.0, 16.9, 15.8, 13.9, 13.9, 13.9, 13.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        }
    },
    {
        name: "Guitar 25.5 10-46 E 12",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [12],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 23.4, 16.9, 23.2],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar_12
        }
    },
    {
        name: "Guitar 25.5 10-46 E 10",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [10],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 16.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar_10
        }
    },
    {
        name: "Guitar 25.5 10-46 E 11",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [11],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 23.4, 16.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar_11
        }
    },
    {
        name: "Bass 34 105 E",
        instrument: "bass",
        scale: 34,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass
        }
    },
    {
        name: "Bass 34 105 E 6",
        instrument: "bass",
        scale: 34,
        forStrings: [6],
        tensions: [39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_6
        }
    },
    {
        name: "Bass 34 105 E 7",
        instrument: "bass",
        scale: 34,
        forStrings: [7],
        tensions: [39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_7
        }
    },
    {
        name: "Bass 34 100 E 8",
        instrument: "bass",
        scale: 34,
        forStrings: [8, 10],
        tensions: [42.5, 33.0, 48.4, 37.5, 40.1, 40.8, 34.7, 35.6, 32.1, 36.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_8
        }
    },
    {
        name: "Bass 34 105 E 9",
        instrument: "bass",
        scale: 34,
        forStrings: [9, 11],
        tensions: [30, 39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1, 30, 25, 25],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_9
        }
    },
    {
        name: "Bass 34 100 E 12",
        instrument: "bass",
        scale: 34,
        forStrings: [12],
        tensions: [42.5, 33.0, 33.0, 48.4, 37.5, 37.5, 40.1, 40.8, 40.8, 34.7, 35.6, 35.6, 32.1, 36.1, 36.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_12
        }
    },
    {
        name: "Banjo 11 G 5",
        instrument: "other",
        scale: 26.25,
        forStrings: [5, 6, 7, 9, 11],
        tensions: [16.5, 13.9, 10.3, 14.1, 16.4, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0],
        tuning: {
            name: "Banjo G",
            type: "other",
            strings: defaultTunings.other_banjo
        }
    },
    {
        name: "Mandolin 13 G 36",
        instrument: "other",
        scale: 13.875,
        forStrings: [8, 12],
        tensions: [23.2, 23.2, 19.3, 19.3, 26.5, 26.5, 20.2, 20.2, 20.0, 20.0, 20.0, 20.0],
        tuning: {
            name: "Mandolin",
            type: "other",
            strings: defaultTunings.other_mandolin
        }
    },
    {
        name: "Pedal Steel 24.25 B9 10",
        instrument: "other",
        scale: 24.25,
        forStrings: [10],
        tensions: [31.2, 29.4, 28.2, 28.8, 23.8, 23.3, 26.3, 28.1, 27.6, 23.8],
        tuning: {
            name: "Pedal Steel E9",
            type: "other",
            strings: defaultTunings.other_pedalsteel
        }
    },
    {
        name: "Ukulele Soprano G",
        instrument: "other",
        scale: 13,
        forStrings: [1, 2, 3, 4],
        tensions: [7.5, 5.9, 5.5, 6.4],
        tuning: {
            name: "Ukulele Soprano G",
            type: "other",
            strings: defaultTunings.other_ukulele
        }
    },
    {
        name: "Guitar 24.75 10-46 E",
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [15.3, 14.5, 15.6, 17.4, 17.9, 15.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        }
    },
    {
        name: "Guitar 25.5 9-42 E",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [13.1, 11.0, 14.7, 15.7, 15.5, 14.4],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        }
    },
    {
        name: "Guitar 24.75 9-42 E",
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [12.4, 10.4, 13.8, 14.8, 14.6, 13.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        }
    },
    {
        name: "Guitar 24.75 9-42 E",
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [12.4, 10.4, 13.8, 14.8, 14.6, 13.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        }
    },
]

export const defaultUser: UserData = {
    username: 'CoolGuy',
    instruments: ['0', '1'],
    tunings: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    instPresets: INST_PRESETS,
    tensionPresets: [],
    settings: defaultSettings
}

export const MULTISCALE_SPAN = 1.5

export const EXTERNAL_URLS = {
    github: "https://github.com/b-price/tuning-averager",
    benWebsite: "https://bpricedev.com",
    patreon: "https://www.patreon.com/bricedev",
    email: "mailto:bpricedev@gmail.com"
}

export const FAQS = [
    {
        question: `What's this for?`,
        answer: `${APP_NAME} allows you find the best string gauges for your stringed instrument. It lets you find what 
            the average tuning is for all the tunings you use and get a string set to match that. You can input your preferred
            string tension or use the preset tension to calculate the string gauges. Then you can tweak the set, seeing
            instant updates for the string tension of each string.`
    },
    {
        question: `What does 'Target Tension' mean?`,
        answer: `These are the tensions of each string of your instrument, in pounds per inch. Think of it as how tight
            you'd like your strings to be. The higher the number, the tighter the string will be. Higher tension usually
            results in brighter tone and more sustain.`
    },
    {
        question: `What is 'Weighted Mode'?`,
        answer: `If weighted mode is on, when the tunings of an instrument are averaged, how often a string is
                    tuned
                    to a note is taken into account. Otherwise, it is not. For example, say you have a guitar with
                    E Standard, Drop D, and E-Flat standard. In weighted mode, the 5th string would be G#2 + 66
                    cents,
                    because A appears twice and G# appears once. If not in weighted mode, the 5th string would be G#2 + 50
                    cents;
                    A is not counted twice.`
    },
    {
        question: `Why do I have to make an account?`,
        answer: `So you can save all your instruments, tunings, and string sets. You wouldn't wanna lose all that hard work!`
    },
    {
        question: `Is ${APP_NAME} free?`,
        answer: `Yes. You can support me at the "Leave me a tip" link below, though.`
    },
    {
        question: `Why'd you make this?`,
        answer: `Good question. I love using many different tunings on my guitars and I wanted something that figured out 
            what string gauges to use. I also always like doing random coding projects!`
    },
    {
        question: `What sort of strings are the gauges based on?`,
        answer: `Because D'Addario has exhaustive information on their strings (and they're popular), I went with them.
            Guitar and bass strings are Nickel Wound XLs. I'm working on adding more options for this, but for now these
            strings are a good representative for what's out there. You can tweak the preset tensions of your instrument
            to approximate variations in the materials/manufacturing of strings.`
    },
    {
        question: `Something's broken or messed up!`,
        answer: `You can contact me at the "Contact" link below, thanks!`
    },
    {
        question: `Other? Why don't you have x instrument?`,
        answer: `I'd like to add more explicit support for different instruments in the future, but for now you should be
            able to make pretty much anything you can think of with a combination of string count, scale length, and tension.`
    },
]

export const EXPORT_TEXT = {
    Strings: "Shows how often each string gauge appears in your saved string sets. Good for making bulk string orders!",
    StringSets: "A list of all of your saved string sets and to what instrument they belong.",
    Instruments: "A list of all of your saved instruments.",
    Tunings: "A list of all of your saved tunings.",
}