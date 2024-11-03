export interface tuning {
    name: string;
    strings: guitarString[];
    type: 'guitar' | 'bass' | 'other';
}

export interface guitarString {
    note: string;
    noteValue: number | null;
}