import {stringAverage, convertToNoteValue} from "../utils/calculate.ts";
import {Tuning} from "../../types.ts";

const standardTuning: Tuning = {
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

const standardTuningCorrect: Tuning = {
    name: 'E Standard',
    strings: [
        {note: 'E 4', noteValue: 51},
        {note: 'B 3', noteValue: 46},
        {note: 'G 3', noteValue: 42},
        {note: 'D 3', noteValue: 37},
        {note: 'A 2', noteValue: 32},
        {note: 'E 2', noteValue: 27}
    ],
    type: 'guitar'
}

const bassStandardTuning: Tuning = {
    name: 'Bass E Standard',
    strings: [
        {note: 'G 2', noteValue: 0},
        {note: 'D 2', noteValue: 0},
        {note: 'A 1', noteValue: 0},
        {note: 'E 1', noteValue: 0}
    ],
    type: 'bass'
}

const eflatTuning: Tuning = {
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

const eflatTuningCorrect: Tuning = {
    name: 'Eb Standard',
    strings: [
        {note: 'D#4', noteValue: 50},
        {note: 'A#3', noteValue: 45},
        {note: 'F#3', noteValue: 41},
        {note: 'C#3', noteValue: 36},
        {note: 'G#2', noteValue: 31},
        {note: 'D#2', noteValue: 26}
    ],
    type: 'guitar'
}

const bflatTuning: Tuning = {
    name: 'Eb Standard',
    strings: [
        {note: 'A#3', noteValue: 45},
        {note: 'F 3', noteValue: 40},
        {note: 'C#3', noteValue: 36},
        {note: 'G#1', noteValue: 31},
        {note: 'D#2', noteValue: 26},
        {note: 'A#1', noteValue: 21}
    ],
    type: 'guitar'
}

const eAndBFlataverage = [24, 29, 34, 39, 43, 48]

standardTuning.strings.forEach(string => {
    string.noteValue = convertToNoteValue(string.note)
})

eflatTuning.strings.forEach(string => {
    string.noteValue = convertToNoteValue(string.note)
})

const eToBFlatTest = stringAverage([standardTuningCorrect, bflatTuning])

test('Convert values Eb', () => {
    expect(eflatTuning.strings).toEqual(eflatTuningCorrect.strings)
})
test('Convert values E', () => {
    expect(standardTuning.strings).toEqual(standardTuningCorrect.strings)
})
test('Average: E and Bb', () => {
    expect(eToBFlatTest).toEqual(eAndBFlataverage)
})
test('Bass and Guitar', () => {
    expect(stringAverage([standardTuningCorrect, bassStandardTuning])).toEqual(null)
})



