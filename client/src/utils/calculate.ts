import {Tuning} from "../../../types";
import {MULTISCALE_SPAN, notes, PLAIN_CHAR, WOUND_CHAR, woundOverlap} from "../defaults.ts";

export function tuningWeight(tuning: Tuning){
    let sum = 0;

    tuning.strings.forEach(str => {
        sum += str.noteValue;
    })
    return sum / tuning.strings.length;
}

export function stringAverage(tunings: Tuning[]){
    const sameType = checkStringMatch(tunings);
    if (!sameType) {
        return ;
    }
    const avNoteValues = [];
    const amountStrings = tunings[0].strings.length;
    for (let i = 0; i < amountStrings; i++){
        let sum = 0;
        tunings.forEach((tuning) => {
            sum += tuning.strings[i].noteValue;
        })
        avNoteValues.push(sum / tunings.length);
    }
    return avNoteValues;
}

export function stringAverageUnweighted(tunings: Tuning[]){
    if (!checkStringMatch(tunings)) {
        return ;
    }
    const avNoteValues = [];
    const amountStrings = tunings[0].strings.length;
    for (let i = 0; i < amountStrings; i++){
        let sum = 0;
        let unique = 0;
        const notes: number[] = [];
        tunings.forEach((tuning) => {
            const value = tuning.strings[i].noteValue;
            if (!notes.includes(value)){
                sum += value;
                unique++;
            }
            notes.push(value);
        })
        avNoteValues.push(sum / unique);
    }
    return avNoteValues;
}

export function convertToNoteValue(note: string){
    if (note.length != 3 || (note[1] !== ' ' && note[1] !== '#'))
        return 0;
    const letter = note[0].toLowerCase();
    const sharp = note[1] === '#'? 1: 0;
    const octave = parseInt(note[2]) > 0 ? (parseInt(note[2]) * 12) - 1 : 0;
    let letterValue;
    switch(letter){
        case 'c':
            letterValue = 0;
            break;
        case 'd':
            letterValue = 2;
            break;
        case 'e':
            letterValue = 4;
            break;
        case 'f':
            letterValue = 5;
            break;
        case 'g':
            letterValue = 7;
            break;
        case 'a':
            letterValue = 9;
            break;
        case 'b':
            letterValue = 11;
            break;
        default:
            return 0;
    }
    return octave + letterValue + sharp;
}

export function convertToNote(noteValue: number){
    if (noteValue < 0 || noteValue >= notes.length){
        return {note: 'invalid', cents: 0, noteValue: noteValue};
        //return 'invalid note';
    }
    const intNote = Math.floor(noteValue);
    const cents = Math.round(((noteValue - intNote) * 100));
    // let cents = ``;
    // if (remainder < 0) {
    //     cents = `${remainder.toFixed()}`;
    // } else if (remainder > 0){
    //     cents = `+${remainder.toFixed()}`;
    // }
    return {note: notes[intNote], cents: cents, noteValue: noteValue};
    //return `${notes[intNote]}${cents}`

}

function checkStringMatch(tunings: Tuning[]){
    if(tunings.length <= 0){
        return false;
    }
    const numStrings = tunings.map(guitar => {
        return [guitar.strings.length, guitar.type];
    })
    return numStrings.every(g => g[0] === numStrings[0][0]) &&
        numStrings.every(g => g[1] === numStrings[0][1]);
}

export function getFrequency(noteValue: number) {
    if (noteValue < 0) {
        return 0;
    }
    noteValue -= 57;
    return 440 * (Math.pow(2, noteValue / 12))
}

export function getUnitWeight(noteValue: number, scale: number, tension: number) {
    const frequency = getFrequency(noteValue);
    if (frequency <= 0){
        return 0;
    }
    return (tension * 386.4) / Math.pow(2 * scale * frequency, 2);
}

export function stringGauge(uw: number, coefficient: number, power: number) {
    if (uw <= 0) {
        return 0;
    }
    const factor = (10000000 * uw) / coefficient;
    const gauge = Math.pow(factor, 1 / power);

    if (gauge < 13){
        return Math.round(gauge * 2) / 2;
    } else {
        return Math.round(gauge);
    }
}

export function tension(uw: number, noteValue: number, scale: number) {
    const frequency = getFrequency(noteValue);
    if (frequency <= 0){
        return 0;
    }
    return (uw * Math.pow(2 * scale * frequency, 2)) / 386.4
}

export function uwFromGauge(gauge: number, coefficient: number, power: number) {
    return (coefficient * Math.pow(gauge, power)) / 10000000
}

export function round(num: number, precision: number) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

export const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const getCents = (noteValue: number) => {
    return Math.round(noteValue * 100) - (Math.round(noteValue) * 100);
}

export const getPW = (gauge: number, wound: boolean) => {
    if (gauge >= woundOverlap[0] && gauge <= woundOverlap[1]) {
        return wound ? WOUND_CHAR : PLAIN_CHAR;
    } else {
        return "";
    }
}

export const getMultiscale = (scale: number, strings: number) => {
    const scales = [];
    const gap = MULTISCALE_SPAN / (strings - 1);
    for (let i = 0; i < strings; i++) {
        scales.push(i * gap + scale);
    }
    return scales;
}

/*
To calculate the tension of a string in pounds use the formula below,
inserting the three variables described above:
T (Tension) = (UW x (2 x L x F)2
) / 386.4
To convert the result into Newtons, simply multiply by 4.45.
If you know what tension you want the string to have, you can calculate the string
unit weight. You can then use the charts in this guide to locate a string with
approximately the same desired unit weight.
UW (unit weight) = (T x 386.4) / (2 x L x F)2
 */