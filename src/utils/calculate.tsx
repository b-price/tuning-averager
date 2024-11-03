import {tuning} from "../types.ts";

export function tuningWeight(tuning: tuning){
    let sum = 0;

    tuning.strings.forEach(str => {
        sum += str.noteValue;
    })
    return sum / tuning.strings.length;
}
export function stringAverage(tunings: tuning[]){
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
    if (note.length != 3)
        return null;
    const letter = note[0].toLowerCase();
    const sharp = note[1] === '#'? 1: 0;
    const octave = parseInt(note[2]) * 12 - 1;
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
            letterValue = 0;
    }
    return octave + letterValue + sharp;
}

function checkStringMatch(tunings: tuning[]){
    let match = false;
    if(tunings.length <= 0){
        return match;
    }
    const numStrings = tunings.map(guitar => {
        return [guitar.strings.length, guitar.type];
    })
    match = numStrings.every(g => g === numStrings[0]);
    return match;
}