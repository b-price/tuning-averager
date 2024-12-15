import {Instrument, Tuning, UserData} from "../../types.ts";


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

const intStrings = Array.from({length: 200 - 13}, (_v, k) => k + 13)

export const STRING_GAUGES = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, ...intStrings]

export const presetTunings: Tuning[] = [
    {
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
    },
    {
        id: '1',
        name: 'Eb Standard',
        strings: [
            { note: 'D#4', noteValue: notes.indexOf('D#4') },
            { note: 'A#3', noteValue: notes.indexOf('A#3') },
            { note: 'F#3', noteValue: notes.indexOf('F#3') },
            { note: 'C#3', noteValue: notes.indexOf('C#3') },
            { note: 'G#2', noteValue: notes.indexOf('G#2') },
            { note: 'D#2', noteValue: notes.indexOf('D#2') },
        ],
        type: 'guitar',
    },
    {
        id: '2',
        name: 'DADGAD',
        strings: [
            { note: 'D4', noteValue: notes.indexOf('D4') },
            { note: 'A3', noteValue: notes.indexOf('A3') },
            { note: 'G3', noteValue: notes.indexOf('G3') },
            { note: 'D3', noteValue: notes.indexOf('D3') },
            { note: 'A2', noteValue: notes.indexOf('A2') },
            { note: 'D2', noteValue: notes.indexOf('D2') },
        ],
        type: 'guitar',
    },
    {
        id: '3',
        name: 'AADGAD',
        strings: [
            { note: 'D4', noteValue: notes.indexOf('D4') },
            { note: 'A3', noteValue: notes.indexOf('A3') },
            { note: 'G3', noteValue: notes.indexOf('G3') },
            { note: 'D3', noteValue: notes.indexOf('D3') },
            { note: 'A2', noteValue: notes.indexOf('A2') },
            { note: 'A1', noteValue: notes.indexOf('A1') },
        ],
        type: 'guitar',
    },
    {
        id: '4',
        name: '7 String Standard',
        strings: [
            { note: 'E4', noteValue: notes.indexOf('E4') },
            { note: 'B3', noteValue: notes.indexOf('B3') },
            { note: 'G3', noteValue: notes.indexOf('G3') },
            { note: 'D3', noteValue: notes.indexOf('D3') },
            { note: 'A2', noteValue: notes.indexOf('A2') },
            { note: 'E2', noteValue: notes.indexOf('E2') },
            { note: 'B1', noteValue: notes.indexOf('B1') },
        ],
        type: 'guitar',
    },
    {
        id: '5',
        name: 'E Standard',
        strings: [
            { note: 'G2', noteValue: notes.indexOf('G2') },
            { note: 'D2', noteValue: notes.indexOf('D2') },
            { note: 'A1', noteValue: notes.indexOf('A1') },
            { note: 'E1', noteValue: notes.indexOf('E1') },
        ],
        type: 'bass',
    },
    {
        id: '6',
        name: '5 String Standard',
        strings: [
            { note: 'G2', noteValue: notes.indexOf('G2') },
            { note: 'D2', noteValue: notes.indexOf('D2') },
            { note: 'A1', noteValue: notes.indexOf('A1') },
            { note: 'E1', noteValue: notes.indexOf('E1') },
            { note: 'B0', noteValue: notes.indexOf('B0') },
        ],
        type: 'bass',
    },
    {
        id: '7',
        name: '6 String Standard',
        strings: [
            { note: 'C3', noteValue: notes.indexOf('C3') },
            { note: 'G2', noteValue: notes.indexOf('G2') },
            { note: 'D2', noteValue: notes.indexOf('D2') },
            { note: 'A1', noteValue: notes.indexOf('A1') },
            { note: 'E1', noteValue: notes.indexOf('E1') },
            { note: 'B0', noteValue: notes.indexOf('B0') },
        ],
        type: 'bass',
    },
    {
        id: '8',
        name: 'Ukulele Standard',
        strings: [
            { note: 'A4', noteValue: notes.indexOf('A4') },
            { note: 'E4', noteValue: notes.indexOf('E4') },
            { note: 'C4', noteValue: notes.indexOf('C4') },
            { note: 'G4', noteValue: notes.indexOf('G4') },
        ],
        type: 'other',
    },
]

export const presetInstruments: Instrument[] = [
    {
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
    },
    {
        id: '1',
        name: 'J Bass',
        strings: 4,
        tunings: [
            {
                id: '5',
                name: 'E Standard',
                strings: [
                    { note: 'G2', noteValue: 31 },
                    { note: 'D2', noteValue: 26 },
                    { note: 'A1', noteValue: 21 },
                    { note: 'E1', noteValue: 16 },
                ],
                type: 'bass',
            },
        ],
        scale: 34,
        targetTension: [42.5, 48.4, 40.1, 34.7],
        type: 'bass',
        stringSets: [
            {
                id: '1',
                name: '45-100',
                gauges: [45, 65, 80, 100],
                woundStrings: [true, true, true, true],
                tensions: [42.5, 48.4, 40.1, 34.7],
                noteValues: [31, 26, 21, 16]
            },
        ]
    }
];

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
    other: [
        { note: 'A4', noteValue: notes.indexOf('A4') },
        { note: 'E4', noteValue: notes.indexOf('E4') },
        { note: 'C4', noteValue: notes.indexOf('C4') },
        { note: 'G4', noteValue: notes.indexOf('G4') },
    ]
};

export const defaultTensions = {
    guitar: [16.2, 15.4, 16.6, 18.4, 19, 16.9, 15.8, 13.9, 13.9],
    bass: [42.5, 48.4, 40.1, 34.7, 32.1, 30, 25, 25, 25],
    other: [7.5, 5.9, 5.5, 6.4, 6, 6, 6, 6, 6],
}

export const stringRange: [number, number] = [3, 9]

export const woundOverlap = [18, 22]

export const stringTypeFactors = {
    guitar: {
        plain: {coeff: 2.215, power: 2},
        wound: {coeff: 2.07, power: 1.97},
    },
    bass: {
        plain: {coeff: 2.939, power: 1.89},
        wound: {coeff: 2.939, power: 1.89},
    },
    other: {
        plain: {coeff: 2.215, power: 2},
        wound: {coeff: 2.215, power: 2},
    },
}

export const serverURL = 'http://localhost:8080';

export const DECIMAL_POINTS = 2

export const defaultSettings = {
    weightedMode: true,
    darkMode: false,
    stringCoeff: 0,
    stringPower: 0,
}

export const defaultUser: UserData = {
    username: 'CoolGuy',
    instruments: ['0', '1'],
    tunings: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    settings: defaultSettings
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

export const TENSION_PRESETS = {
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
}