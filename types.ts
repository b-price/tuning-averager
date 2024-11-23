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

export class UserData {
    constructor(
        public username: string,
        public instruments: string[],
        public tunings: string[],
        public id?: string,
    ) {
    }
}