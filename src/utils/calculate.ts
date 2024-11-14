import {Tuning} from "../types";

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
        return null;
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

export function stringGauge(noteValue: number, scale: number, tension: number, inst: string, wound: boolean) {
    const uw = getUnitWeight(noteValue, scale, tension);
    if (uw <= 0) {
        return 0;
    }
    let coefficient = 10000000 * uw;
    let power = 2;
    switch (inst){
        case 'guitar':
            if (wound){
                coefficient /= 2.07;
                power = 1.97;
            } else {
                coefficient /= 2.215;
            }
            break;
        case 'bass':
            coefficient /= 2.939;
            power = 1.89;
            break;
        default:
            coefficient /= 2.215;
    }
    const gauge = Math.pow(coefficient, 1 / power);

    if (gauge < 13){
        return Math.round(gauge * 2) / 2;
    } else {
        return Math.round(gauge);
    }
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