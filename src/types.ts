export interface Tuning {
    name: string;
    strings: GuitarString[];
    type: 'guitar' | 'bass' | 'other';
}

export interface GuitarString {
    note: string;
    noteValue: number;
}

export interface Instrument {
    name: string;
    strings: number;
    tunings: Tuning[];
    scale: number;
    targetTension: number[];
    type: 'guitar' | 'bass' | 'other';
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
}