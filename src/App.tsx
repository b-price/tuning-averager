
import './App.css'
import {Instrument, Tuning} from "./types.ts";
import InstrumentInput from "./components/InstrumentInput.tsx";


const onInstInput = (instr: Instrument) => {
    console.log(instr);
}

const notes = [
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

const presetTunings: Tuning[] = [
    {
        name: 'Guitar Standard',
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
        name: 'Guitar DADGAD',
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
        name: 'Guitar 7 String',
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
        name: 'Bass Standard',
        strings: [
            { note: 'G2', noteValue: notes.indexOf('G2') },
            { note: 'D2', noteValue: notes.indexOf('D2') },
            { note: 'A1', noteValue: notes.indexOf('A1') },
            { note: 'E1', noteValue: notes.indexOf('E1') },
        ],
        type: 'bass',
    },
    {
        name: 'Bass 5 String',
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
        name: 'Bass 6 String',
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

const defaultTunings = {
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

const defaultTensions = {
    guitar: [16.2, 15.4, 16.6, 18.4, 19, 16.9, 15.8, 13.9, 13.9],
    bass: [42.5, 48.4, 40.1, 34.7, 32.1, 30, 25, 25, 25],
    other: [7.5, 5.9, 5.5, 6.4, 6, 6, 6, 6, 6],
}

const stringRange: [number, number] = [3, 9]

function App() {

  return (
      <>
          <InstrumentInput onSubmit={onInstInput} tunings={presetTunings} targetTensions={defaultTensions} stringRange={stringRange} />

      </>
  )
}

export default App
