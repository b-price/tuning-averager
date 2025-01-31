import {Tuning} from "../../types.ts";
import {
    A4_OFFSET, DEFAULT_STRING_MATERIAL,
    MAX_STRING_GAUGE,
    MIN_STRING_GAUGE,
    MULTISCALE_SPAN,
    NOTES,
    PLAIN_CHAR,
    PRECISE_GAUGE,
    REFERENCE_PITCH,
    STRING_MATERIAL_FACTORS,
    WOUND_CHAR,
    WOUND_OVERLAP
} from "../defaults.ts";

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

export function convertToNote(noteValue: number){
    if (noteValue < 0 || noteValue >= NOTES.length){
        return {note: 'invalid', cents: 0, noteValue: noteValue};
    }
    const intNote = Math.floor(noteValue);
    const cents = Math.round(((noteValue - intNote) * 100));

    return {note: NOTES[intNote], cents: cents, noteValue: noteValue};
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

export function getFrequency(noteValue: number, referencePitch = REFERENCE_PITCH) {
    if (noteValue < 0 || referencePitch < 0) {
        return 0;
    }
    noteValue -= A4_OFFSET;
    return referencePitch * (Math.pow(2, noteValue / 12))
}

export function getUnitWeight(noteValue: number, scale: number, tension: number, referencePitch = REFERENCE_PITCH) {
    const frequency = getFrequency(noteValue, referencePitch);
    if (frequency <= 0 || tension <= 0 || scale <= 0){
        return 0;
    }
    return (tension * 386.4) / Math.pow(2 * scale * frequency, 2);
}

export function stringGauge(uw: number, coefficient: number, power: number) {
    if (uw <= 0) {
        return MIN_STRING_GAUGE;
    }
    const factor = (10000000 * uw) / (coefficient === 0 ? 0.1 : coefficient);
    const gauge = Math.pow(factor, 1 / power);

    if (gauge < MIN_STRING_GAUGE) {
        return MIN_STRING_GAUGE;
    }
    if (gauge > MAX_STRING_GAUGE) {
        return MAX_STRING_GAUGE;
    }
    if (gauge < PRECISE_GAUGE){
        return Math.round(gauge * 2) / 2;
    }

    return Math.round(gauge);
}

export function tension(uw: number, noteValue: number, scale: number, referencePitch = REFERENCE_PITCH) {
    const frequency = getFrequency(noteValue, referencePitch);
    if (frequency <= 0 || scale <= 0 || uw <= 0){
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

export const formatMaterial = (material: string) => {
    return material.replace(/_[a-zA-Z]+_/, ` `).replace('-', ' ');
}

export const getPlain = (material: string) => {
    if (material === 'Kalium') return material;
    if (STRING_MATERIAL_FACTORS[material] && STRING_MATERIAL_FACTORS[material].altPlain) {
        return STRING_MATERIAL_FACTORS[material].altPlain;
    }
    return material.split('_')[0] + '_plain'
}

export const coeffPower = (material: string, wound: boolean) => {
    if (!STRING_MATERIAL_FACTORS[material]) {
        return STRING_MATERIAL_FACTORS[DEFAULT_STRING_MATERIAL.guitar];
    }
    const plain = wound? material : getPlain(material);
    const coeff = wound ? STRING_MATERIAL_FACTORS[material].coeff : STRING_MATERIAL_FACTORS[plain].coeff;
    const power = wound ? STRING_MATERIAL_FACTORS[material].power : STRING_MATERIAL_FACTORS[plain].power;
    return {coeff: coeff, power: power};
}

export const getCents = (noteValue: number) => {
    return Math.round(noteValue * 100) - (Math.round(noteValue) * 100);
}

export const getPW = (gauge: number, wound: boolean) => {
    if (gauge >= WOUND_OVERLAP[0] && gauge <= WOUND_OVERLAP[1]) {
        return wound ? WOUND_CHAR : PLAIN_CHAR;
    } else {
        return "";
    }
}

export const getMultiscale = (scale: number, strings: number, span = MULTISCALE_SPAN) => {
    if (strings === 1) return [scale];
    const scales = [];
    const gap = span / (strings - 1);
    for (let i = 0; i < strings; i++) {
        scales.push(i * gap + scale);
    }
    return scales;
}