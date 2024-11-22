// export interface Tuning {
//     _id?: string;
//     name: string;
//     strings: GuitarString[];
//     type: 'guitar' | 'bass' | 'other';
// }

import {ObjectId} from "mongodb";

export class Tuning {
    constructor(
        public name: string,
        public strings: GuitarString[],
        public type: 'guitar' | 'bass' | 'other',
        public id?: string,
    ) {
    }
}

export interface GuitarString {
    note: string;
    noteValue: number;
}

// export interface Instrument {
//     _id?: string;
//     name: string;
//     strings: number;
//     tunings: Tuning[];
//     scale: number;
//     targetTension: number[];
//     type: 'guitar' | 'bass' | 'other';
//     stringSets: StringSet[];
// }

export class Instrument {
    constructor(
        public name: string,
        public strings: number,
        public tunings: Tuning[],
        public scale: number,
        public targetTension: number[],
        public type: 'guitar' | 'bass' | 'other',
        public stringSets: StringSet[],
        public id?: string,
    ) {
    }
}

export interface StringSet {
    id?: string;
    name: string;
    gauges: number[];
    woundStrings: boolean[];
    tensions: number[];
    noteValues: number[];
}

export interface Transpose {
    prev: number;
    current: number;
}

// export interface UserData {
//     id?: string;
//     username: string;
//     instruments: Instrument[];
//     tunings: Tuning[];
// }

export class UserData {
    constructor(
        public username: string,
        public instruments: string[],
        public tunings: string[],
        public id?: string,
    ) {
    }
}

interface InstrumentInputProps {
    onSubmit: (instrument: Instrument) => void;
    tunings: Tuning[];
    targetTensions: {
        guitar: number[];
        bass: number[];
        other: number[];
    };
    stringRange: [number, number];
}

interface TuningInputProps {
    notes: string[];
    presetTunings: Tuning[];
    defaultTunings: { guitar: GuitarString[], bass: GuitarString[], other: GuitarString[] };
    onSubmit: (tuning: Tuning) => void;
}