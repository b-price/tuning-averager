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
    stringMaterial?: string;
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

export interface Note {
    note: string;
    cents: number;
    noteValue: number;
}

export type MessageType = 'success' | 'error' | 'warning';

export type StringFactors = {
    [material: string]: {coeff: number, power: number}
}

export type ExportSelection = "Instruments" | "Tunings" | "StringSets" | "Strings";
export type ExportText = {
    [option in ExportSelection]: string;
};