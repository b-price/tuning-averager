export interface Tuning {
    _id: string;
    name: string;
    strings: GuitarString[];
    type: 'guitar' | 'bass' | 'other';
}

export interface GuitarString {
    note: string;
    noteValue: number;
}

export interface Instrument {
    _id: string;
    name: string;
    strings: number;
    tunings: Tuning[];
    scale: number;
    targetTension: number[];
    type: 'guitar' | 'bass' | 'other';
    stringSets: StringSet[];
}

export interface StringSet {
    _id: string;
    name: string;
    gauges: number[];
    woundStrings: boolean[];
}

export interface Transpose {
    prev: number;
    current: number;
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