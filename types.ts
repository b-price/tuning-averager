export class Tuning {
    constructor(
        public name: string,
        public strings: GuitarString[],
        public type: InstType,
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
        public type: InstType,
        public stringSets: StringSet[],
        public isMultiscale?: boolean,
        public scales?: number[],
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
    favorite?: boolean;
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
        public settings: UserSettings,
        public instPresets: InstPreset[],
        public tensionPresets: TensionPreset[],
        public id?: string,
    ) {
    }
}

export class UserSettings {
    constructor(
        public weightedMode: boolean,
        public stringCoeff: number,
        public stringPower: number,
        public darkMode: boolean,
        public useOSTheme: boolean,
        public referencePitch: number,
    ) {
    }
}

export type InstType = 'guitar' | 'bass' | 'other';

export interface InstPreset {
    name: string;
    instrument: InstType;
    forStrings: number[];
    scale: number;
    tensions: number[];
    tuning: Tuning;
    id: string;
}

export interface TensionPreset {
    name?: string;
    tensions: number[];
    type: InstType;
}