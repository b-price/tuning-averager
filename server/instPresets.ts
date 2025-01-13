import {InstPreset} from "../types";

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
    bass_VI: [
        { note: 'E3', noteValue: notes.indexOf('E3') },
        { note: 'B2', noteValue: notes.indexOf('B2') },
        { note: 'G2', noteValue: notes.indexOf('G2') },
        { note: 'D2', noteValue: notes.indexOf('D2') },
        { note: 'A1', noteValue: notes.indexOf('A1') },
        { note: 'E1', noteValue: notes.indexOf('E1') },
    ],
    guitar_baritone: [
        { note: 'B3', noteValue: notes.indexOf('B3') },
        { note: 'F#3', noteValue: notes.indexOf('F#3') },
        { note: 'D3', noteValue: notes.indexOf('D3') },
        { note: 'A2', noteValue: notes.indexOf('A2') },
        { note: 'E2', noteValue: notes.indexOf('E2') },
        { note: 'B1', noteValue: notes.indexOf('B1') },
        { note: 'F#1', noteValue: notes.indexOf('F#1') },
        { note: 'C#1', noteValue: notes.indexOf('C#1') },
    ],
};

export const INST_PRESETS_SERVER: InstPreset[] = [
    {
        name: "Guitar 25.5 10-46 E",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tensions: [16.2, 15.4, 16.6, 18.4, 19.0, 16.9, 15.8, 13.9, 13.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar1-6",
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
        },
        id: "guitar1-12",
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
        },
        id: "guitar1-10",
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
        },
        id: "guitar1-11",
    },
    {
        name: "Bass 34 100 E",
        instrument: "bass",
        scale: 34,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass
        },
        id: "bass1-4",
    },
    {
        name: "Bass 34 105 E",
        instrument: "bass",
        scale: 34,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [50.3, 55.6, 45.3, 38.1, 35.0],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass
        },
        id: "bass2-4",
    },
    {
        name: "Bass 30 105 E",
        instrument: "bass",
        scale: 30,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [39.2, 43.3, 35.3, 29.6, 27.3],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass
        },
        id: "bass3-4",
    },
    {
        name: "Bass 32 105 E",
        instrument: "bass",
        scale: 32,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [44.6, 49.3, 40.2, 33.7, 31.0],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass
        },
        id: "bass4-4",
    },
    {
        name: "Bass 34 100 E 6",
        instrument: "bass",
        scale: 34,
        forStrings: [6],
        tensions: [39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_6
        },
        id: "bass1-6",
    },
    {
        name: "Bass 34 100 E 7",
        instrument: "bass",
        scale: 34,
        forStrings: [7],
        tensions: [39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_7
        },
        id: "bass1-7",
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
        },
        id: "bass1-8",
    },
    {
        name: "Bass 34 100 E 9",
        instrument: "bass",
        scale: 34,
        forStrings: [9, 11],
        tensions: [30, 39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1, 30, 25, 25],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: defaultTunings.bass_9
        },
        id: "bass1-9",
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
        },
        id: "bass1-11",
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
        },
        id: "banjo1",
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
        },
        id: "mandolin1",
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
        },
        id: "pedalsteel1",
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
        },
        id: "uke1",
    },
    {
        name: "Guitar 24.75 10-46 E",
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [15.3, 14.5, 15.6, 17.4, 17.9, 15.9, 15.0, 12.3, 10.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar2-6",
    },
    {
        name: "Guitar 25.5 9-42 E",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [13.1, 11.0, 14.7, 15.7, 15.5, 14.4, 13.3, 13.0, 12.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar3-6",
    },
    {
        name: "Guitar 24.75 9-42 E",
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [12.4, 10.4, 13.8, 14.8, 14.6, 13.5, 12.5, 10.0, 9.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar4-6",
    },
    {
        name: "Guitar 24 9-42 E",
        instrument: "guitar",
        scale: 24,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [11.6, 9.8, 13.0, 13.9, 13.7, 12.7, 11.7, 9.4, 9.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar5-6",
    },
    {
        name: "Guitar 24 10-46 E",
        instrument: "guitar",
        scale: 24,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [14.4, 13.6, 14.7, 16.3, 16.9, 15.0, 14.1, 11.6, 9.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar6-6",
    },
    {
        name: "Guitar 25.5 12-52 E",
        instrument: "guitar",
        scale: 25.5,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [23.4, 23.3, 28.0, 27.6, 25.6, 21.1, 21.0, 19.0, 15.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.guitar
        },
        id: "guitar7-6",
    },
    {
        name: "Bass VI 30 84-24 E",
        instrument: "bass",
        scale: 30,
        forStrings: [6],
        tensions: [27.4, 30.0, 30.6, 27.7, 25.6, 19.8],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: defaultTunings.bass_VI
        },
        id: "bassVI1",
    },
    {
        name: "Baritone 27 14-68 B",
        instrument: "guitar",
        scale: 27,
        forStrings: [6, 7, 8],
        tensions: [20.0, 18.6, 20.6, 31.2, 28.3, 23.5, 20.2, 16.0],
        tuning: {
            name: "B Standard",
            type: "guitar",
            strings: defaultTunings.guitar_baritone
        },
        id: "baritone1-6",
    },
    {
        name: "Baritone 27 13-62 B",
        instrument: "guitar",
        scale: 27,
        forStrings: [6, 7, 8],
        tensions: [17.3, 16.6, 20.6, 21.3, 19.0, 19.6, 15.3, 13.0],
        tuning: {
            name: "B Standard",
            type: "guitar",
            strings: defaultTunings.guitar_baritone
        },
        id: "baritone2-6",
    },
]