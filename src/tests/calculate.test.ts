import {stringAverage, convertToNoteValue} from "../utils/calculate.tsx";
import {tuning} from "../types.ts";

const standardTuning: tuning = {
    name: 'E Standard',
    strings: [
        {note: 'E 4', noteValue: 0},
        {note: 'B 3', noteValue: 0},
        {note: 'G 3', noteValue: 0},
        {note: 'D 3', noteValue: 0},
        {note: 'A 2', noteValue: 0},
        {note: 'E 2', noteValue: 0}
    ],
        type: 'guitar'
}

const standardTuningCorrect: tuning = {
    name: 'E Standard',
    strings: [
        {note: 'E 4', noteValue: 0},
        {note: 'B 3', noteValue: 0},
        {note: 'G 3', noteValue: 0},
        {note: 'D 3', noteValue: 0},
        {note: 'A 2', noteValue: 0},
        {note: 'E 2', noteValue: 0}
    ],
    type: 'guitar'
}

const bassStandardTuning: tuning = {
    name: 'Bass E Standard',
    strings: [
        {note: 'G 2', noteValue: 0},
        {note: 'D 2', noteValue: 0},
        {note: 'A 1', noteValue: 0},
        {note: 'E 1', noteValue: 0}
    ],
    type: 'bass'
}

const eflatTuning: tuning = {
    name: 'Eb Standard',
    strings: [
        {note: 'D#4', noteValue: 0},
        {note: 'A#3', noteValue: 0},
        {note: 'F#3', noteValue: 0},
        {note: 'C#3', noteValue: 0},
        {note: 'G#2', noteValue: 0},
        {note: 'D#2', noteValue: 0}
    ],
    type: 'guitar'
}

const eflatTuningCorrect: tuning = {
    name: 'Eb Standard',
    strings: [
        {note: 'D#4', noteValue: 0},
        {note: 'A#3', noteValue: 0},
        {note: 'F#3', noteValue: 0},
        {note: 'C#3', noteValue: 0},
        {note: 'G#2', noteValue: 0},
        {note: 'D#2', noteValue: 0}
    ],
    type: 'guitar'
}

standardTuning.strings.forEach(string => {
    string.noteValue = convertToNoteValue(string.note)
})

eflatTuning.strings.forEach(string => {
    string.noteValue = convertToNoteValue(string.note)
})

expect(eflatTuning.strings).toEqual(eflatTuningCorrect.strings)
expect(standardTuning.strings).toEqual(standardTuningCorrect.strings)