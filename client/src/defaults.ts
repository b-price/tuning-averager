import {Instrument, InstPreset, Tuning, UserData, StringFactors, ExportText} from "../types.ts";

export const APP_NAME = "Ideal Strings"

export const NOTES = [
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
]

export const A4_OFFSET = 57

export const REFERENCE_PITCH = 440

export const MAX_STRING_GAUGE = 500
export const MIN_STRING_GAUGE = 5
export const PRECISE_GAUGE = 13
const intStrings = Array.from({length: MAX_STRING_GAUGE + 1 - PRECISE_GAUGE}, (_v, k) => k + PRECISE_GAUGE)
const halfStrings = Array.from({length: (PRECISE_GAUGE - MIN_STRING_GAUGE) * 2}, (_v, k) => k / 2 + MIN_STRING_GAUGE)
export const STRING_GAUGES = [...halfStrings, ...intStrings]

export const SCALE_LENGTH_RANGE = [10, 100]

export const MIN_TAPER_GAUGE = 65
export const LONG_THIN_GAUGE = 24
export const GUITAR_WARNING_SCALE = 29

export const MAX_TENSION = 1000
export const TENSILE_STRENGTH = 300000

export const DEFAULT_TUNING: Tuning = {
    id: '0',
    name: 'E Standard',
    strings: [
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
    ],
    type: 'guitar',
}


export const DEFAULT_INST: Instrument = {
    id: '0',
    name: 'Stratocaster',
    strings: 6,
    tunings: [
        {
            id: '0',
            name: 'E Standard',
            strings: [
                { note: 'E4', noteValue: 52 },
                { note: 'B3', noteValue: 47 },
                { note: 'G3', noteValue: 43 },
                { note: 'D3', noteValue: 38 },
                { note: 'A2', noteValue: 33 },
                { note: 'E2', noteValue: 28 },
            ],
            type: 'guitar',
        },
        {
            id: '2',
            name: 'DADGAD',
            strings: [
                { note: 'D4', noteValue: 50 },
                { note: 'A3', noteValue: 45 },
                { note: 'G3', noteValue: 43 },
                { note: 'D3', noteValue: 38 },
                { note: 'A2', noteValue: 33 },
                { note: 'D2', noteValue: 26 },
            ],
            type: 'guitar',
        },
    ],
    scale: 25.5,
    targetTension: [16.2, 15.4, 16.6, 18.4, 19, 16.9],
    type: 'guitar',
    stringSets: [
        {
            id: '0',
            name: '10-46',
            gauges: [10, 13, 17, 26, 36, 46],
            woundStrings: [false, false, false, true, true, true],
            tensions: [16.2, 15.4, 16.6, 18.4, 19, 16.9],
            noteValues: [28, 33, 38, 43, 47, 53]
        },
    ]
}

export const DEFAULT_TUNINGS = {
    guitar: [
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
        { note: 'B1', noteValue: NOTES.indexOf('B1') },
        { note: 'F#1', noteValue: NOTES.indexOf('F#1') },
        { note: 'C#1', noteValue: NOTES.indexOf('C#1') },
        { note: 'G#0', noteValue: NOTES.indexOf('G#0') },
        { note: 'D#0', noteValue: NOTES.indexOf('D#0') },
    ],
    guitar_12: [
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'A3', noteValue: NOTES.indexOf('A3') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
        { note: 'E3', noteValue: NOTES.indexOf('E3') },
    ],
    guitar_10: [
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
    ],
    guitar_11: [
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'A3', noteValue: NOTES.indexOf('A3') },
        { note: 'E3', noteValue: NOTES.indexOf('E3') },
    ],
    bass: [
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'B0', noteValue: NOTES.indexOf('B0') },
        { note: 'F#0', noteValue: NOTES.indexOf('F#0') },
        { note: 'C#0', noteValue: NOTES.indexOf('C#0') },
    ],
    bass_6: [
        { note: 'C3', noteValue: NOTES.indexOf('C3') },
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'B0', noteValue: NOTES.indexOf('B0') },
    ],
    bass_7: [
        { note: 'F#3', noteValue: NOTES.indexOf('F#3') },
        { note: 'C3', noteValue: NOTES.indexOf('C3') },
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'B0', noteValue: NOTES.indexOf('B0') },
    ],
    bass_8: [
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
        { note: 'B0', noteValue: NOTES.indexOf('B0') },
        { note: 'B1', noteValue: NOTES.indexOf('B1') },
    ],
    bass_9: [
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'F#3', noteValue: NOTES.indexOf('F#3') },
        { note: 'C3', noteValue: NOTES.indexOf('C3') },
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'B0', noteValue: NOTES.indexOf('B0') },
        { note: 'F#0', noteValue: NOTES.indexOf('F#0') },
        { note: 'C#0', noteValue: NOTES.indexOf('C#0') },
        { note: 'C#0', noteValue: NOTES.indexOf('C#0') },
    ],
    bass_12: [
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
    ],
    other: [
        { note: 'A4', noteValue: NOTES.indexOf('A4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'C4', noteValue: NOTES.indexOf('C4') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
    ],
    other_ukulele: [
        { note: 'A4', noteValue: NOTES.indexOf('A4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'C4', noteValue: NOTES.indexOf('C4') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
    ],
    other_banjo: [
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G4', noteValue: NOTES.indexOf('G4') },
    ],
    other_mandolin: [
        { note: 'E5', noteValue: NOTES.indexOf('E5') },
        { note: 'E5', noteValue: NOTES.indexOf('E5') },
        { note: 'A4', noteValue: NOTES.indexOf('A4') },
        { note: 'A4', noteValue: NOTES.indexOf('A4') },
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'D4', noteValue: NOTES.indexOf('D4') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'G3', noteValue: NOTES.indexOf('G3') },
        { note: 'C3', noteValue: NOTES.indexOf('C3') },
        { note: 'C3', noteValue: NOTES.indexOf('C3') },
        { note: 'F2', noteValue: NOTES.indexOf('F2') },
        { note: 'F2', noteValue: NOTES.indexOf('F2') },
    ],
    other_pedalsteel: [
        { note: 'F#4', noteValue: NOTES.indexOf('F#4') },
        { note: 'D#4', noteValue: NOTES.indexOf('D#4') },
        { note: 'G#4', noteValue: NOTES.indexOf('G#4') },
        { note: 'E4', noteValue: NOTES.indexOf('E4') },
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'G#3', noteValue: NOTES.indexOf('G#3') },
        { note: 'F#3', noteValue: NOTES.indexOf('F#3') },
        { note: 'E3', noteValue: NOTES.indexOf('E3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'B2', noteValue: NOTES.indexOf('B2') },
    ],
    bass_VI: [
        { note: 'E3', noteValue: NOTES.indexOf('E3') },
        { note: 'B2', noteValue: NOTES.indexOf('B2') },
        { note: 'G2', noteValue: NOTES.indexOf('G2') },
        { note: 'D2', noteValue: NOTES.indexOf('D2') },
        { note: 'A1', noteValue: NOTES.indexOf('A1') },
        { note: 'E1', noteValue: NOTES.indexOf('E1') },
    ],
    guitar_baritone: [
        { note: 'B3', noteValue: NOTES.indexOf('B3') },
        { note: 'F#3', noteValue: NOTES.indexOf('F#3') },
        { note: 'D3', noteValue: NOTES.indexOf('D3') },
        { note: 'A2', noteValue: NOTES.indexOf('A2') },
        { note: 'E2', noteValue: NOTES.indexOf('E2') },
        { note: 'B1', noteValue: NOTES.indexOf('B1') },
        { note: 'F#1', noteValue: NOTES.indexOf('F#1') },
        { note: 'C#1', noteValue: NOTES.indexOf('C#1') },
    ],
};

export const STRING_RANGE = [1, 12]
export const VALID_STRINGS = Array.from({length: STRING_RANGE[1] + 1 - STRING_RANGE[0]}, (_v, k) => k + STRING_RANGE[0])

export const WOUND_OVERLAP = [18, 24]

export const PLAIN_CHAR = 'p'
export const WOUND_CHAR = 'w'

export const STRING_MATERIAL_FACTORS: StringFactors = {
    Daddario_plain: {coeff: 2.21492927, power: 2.00004625},
    Daddario_guitar_XL: {coeff: 2.03048974, power: 1.97385195},
    Daddario_guitar_XLS: {coeff: 2.25914446, power: 1.95713584},
    Daddario_guitar_HalfRound: {coeff: 4.7130929, power: 1.76056849},
    Daddario_guitar_Chromes: {coeff: 1.21940071, power: 2.12075013},
    Daddario_guitar_PhosphorBronze: {coeff: 2.40143563, power: 1.95752345},
    Daddario_guitar_8515: {coeff: 2.08953162, power: 1.99082979},
    Daddario_guitar_FlatTopsBronze: {coeff: 4.40613273, power: 1.80524054},
    Daddario_guitar_8020: {coeff: 2.11933174, power: 1.98040335},
    Daddario_guitar_BassVIXL: {coeff: 1.36914611, power: 2.06065643},
    Daddario_plain_RectifiedNylon: {coeff: 0.282545283, power: 2.00006866},
    Daddario_plain_BlackNylon: {coeff: 0.078774083, power: 2.36553601},
    Daddario_plain_ClearNylon: {coeff: 0.199522437, power: 2.08940857},
    Daddario_plain_LaserNylonClear: {coeff: 0.12678731, power: 2.21982913},
    Daddario_plain_LaserNylonBlack: {coeff: 0.134728744, power: 2.20360921},
    Daddario_guitar_ClassicSilverplated: {coeff: 0.442552831, power: 2.36219868, altPlain: 'Daddario_plain_ClearNylon'},
    Daddario_guitar_ProArteSilverplated: {coeff: 0.170024114, power: 2.60364919, altPlain: 'Daddario_plain_LaserNylonClear'},
    Daddario_guitar_ProArte8020: {coeff: 0.179265409, power: 2.57647324, altPlain: 'Daddario_plain_LaserNylonClear'},
    Daddario_guitar_Classic8020: {coeff: 0.163766125, power: 2.58628814, altPlain: 'Daddario_plain_ClearNylon'},
    Daddario_guitar_CompSilverplated: {coeff: 0.280532991, power: 2.46852076, altPlain: 'Daddario_plain_LaserNylonClear'},
    Daddario_guitar_CompSilverPolished: {coeff: 0.341905187, power: 2.42980507, altPlain: 'Daddario_plain_LaserNylonClear'},
    Daddario_guitar_RectifiedNylon: {coeff: 0.170024114, power: 2.60364919, altPlain: 'Daddario_plain_RectifiedNylon'},
    Daddario_bass_XL: {coeff: 2.86193722, power: 1.90016626},
    Daddario_bass_HalfRound: {coeff: 2.74646209, power: 1.91241999},
    Daddario_bass_Chromes: {coeff: 2.60626822, power: 1.92675277},
    Daddario_bass_ProSteels: {coeff: 3.73137984, power: 1.83062765},
    Daddario_bass_PhosphorBronze: {coeff: 3.11439502, power: 1.90107888},
    Daddario_other_BanjoXL: {coeff: 1.89404597, power: 1.98678875},
    Daddario_other_BanjoPhosphorBronze: {coeff: 2.11777804, power: 1.98704533},
    Daddario_other_PedalSteelXLS: {coeff: 2.33950923, power: 1.95004413},
    Daddario_other_MandolinPhosphorBr: {coeff: 1.86993624, power: 2.03972215},
    Daddario_other_Mandolin8020: {coeff: 2.5333114, power: 1.92142171},
    Daddario_other_MandolinNickel: {coeff: 2.75788341, power: 1.88338031},
    Daddario_other_MandolinFlatTops: {coeff: 1.43821824, power: 2.15767558},
    Daddario_other_Mandobass: {coeff: 1.51486634, power: 2.03294771},
    GHS_plain: {coeff: 2.03170652, power: 2.04187443},
    GHS_guitar_Boomers: {coeff: 2.1627709, power: 1.97673144},
    GHS_guitar_ThinCoreBoomers: {coeff: 2.32199706, power: 1.93449862},
    GHS_guitar_CoatedBoomers: {coeff: 1.71103459, power: 2.02017694},
    GHS_guitar_ThickCoreBoomers: {coeff: 3.21813278, power: 1.85489437},
    GHS_guitar_NickelRockers: {coeff: 1.80711638, power: 2.0435134},
    GHS_guitar_BurnishedNickel: {coeff: 4.82005642, power: 1.76560969},
    GHS_guitar_BigCoreNickel: {coeff: 3.24043155, power: 1.88022238},
    GHS_guitar_BriteFlats: {coeff: 4.99711707, power: 1.76531521},
    GHS_guitar_SuperSteels: {coeff: 1.93685245, power: 2.00543412},
    GHS_guitar_Progressives: {coeff: 2.46563163, power: 1.94376591},
    GHS_guitar_PrecisionFlats: {coeff: 3.75762993, power: 1.82191622},
    GHS_guitar_BrightBronze: {coeff: 1.84307113, power: 2.02163758},
    GHS_guitar_ContactCoreBronze: {coeff: 2.61347879, power: 1.92546173},
    GHS_guitar_BronzeRollerwound: {coeff: 4.86791779, power: 1.77968681},
    GHS_guitar_BrightBronzeGround: {coeff: 3.56575273, power: 1.86679482},
    GHS_guitar_PhosphorBronze: {coeff: 2.9371083, power: 1.90060464},
    GHS_guitar_ThinCoreBronze: {coeff: 3.79546768, power: 1.82671529},
    GHS_guitar_Americana: {coeff: 2.12207513, power: 1.98367437},
    GHS_guitar_WhiteBronze: {coeff: 1.21011053, power: 2.12869026},
    GHS_guitar_InfinityBronze: {coeff: 3.80170885, power: 1.83630341},
    GHS_guitar_SilkAndBronze: {coeff: 4.19580302, power: 1.82622626},
    GHS_guitar_SilkAndSteel: {coeff: 1.35103577, power: 2.13381003},
    GHS_guitar_VintageBronze: {coeff: 2.62795121, power: 1.9307925},
    GHS_other_BrightBronze: {coeff: 1.84307113, power: 2.02163758},
    GHS_other_ContactCoreBronze: {coeff: 2.61347879, power: 1.92546173},
    GHS_other_BronzeRollerwound: {coeff: 4.86791779, power: 1.77968681},
    GHS_other_BrightBronzeGround: {coeff: 3.56575273, power: 1.86679482},
    GHS_other_PhosphorBronze: {coeff: 2.9371083, power: 1.90060464},
    GHS_other_ThinCoreBronze: {coeff: 3.79546768, power: 1.82671529},
    GHS_other_Americana: {coeff: 2.12207513, power: 1.98367437},
    GHS_other_WhiteBronze: {coeff: 1.21011053, power: 2.12869026},
    GHS_other_InfinityBronze: {coeff: 3.80170885, power: 1.83630341},
    GHS_other_SilkAndBronze: {coeff: 4.19580302, power: 1.82622626},
    GHS_other_SilkAndSteel: {coeff: 1.35103577, power: 2.13381003},
    GHS_other_VintageBronze: {coeff: 2.62795121, power: 1.9307925},
    GHS_bass_Boomers: {coeff: 2.70417181, power: 1.92225375},
    GHS_bass_SuperSteels: {coeff: 1.76219083, power: 2.01260904},
    GHS_bass_ContactCoreSteel: {coeff: 1.06813673, power: 2.10532432},
    GHS_bass_Bassics: {coeff: 1.3305054, power: 2.07171211},
    GHS_bass_BalancedNickels: {coeff: 10.7328016, power: 1.6185116},
    GHS_bass_Tapewound: {coeff: 4.09751649, power: 1.77567975},
    GHS_bass_RoundCoreBoomers: {coeff: 1.85575465, power: 1.99404547},
    GHS_bass_Crossovers: {coeff: 2.94953361, power: 1.91215541},
    GHS_bass_Pressurewound: {coeff: 2.50641374, power: 1.93936705},
    GHS_bass_PWBronze: {coeff: 3.41366687, power: 1.8733797},
    GHS_bass_BriteFlats: {coeff: 1.27304018, power: 2.08728165},
    GHS_bass_PrecisionFlats: {coeff: 2.29057868, power: 1.96108142},
    Kalium: {coeff: 2.19325412, power: 1.96681613},
    StringJoy_plain: {coeff: 2.43796891, power: 2.0000626},
    StringJoy_guitar_Signatures: {coeff: 2.04848737, power: 1.98133765},
    StringJoy_guitar_Broadways: {coeff: 2.83779503, power: 1.89630505},
    StringJoy_guitar_PhosphorBronze: {coeff: 2.26940493, power: 1.98305114},
    StringJoy_guitar_Brights8020: {coeff: 1.9354414, power: 2.02551248},
    StringJoy_bass_Signatures: {coeff: 3.90556455, power: 1.84285261},
    StringJoy_other_Signatures: {coeff: 2.04848737, power: 1.98133765},
    StringJoy_other_PhosphorBronze: {coeff: 2.26940493, power: 1.98305114},
    StringJoy_other_Brights8020: {coeff: 1.9354414, power: 2.02551248},

}

export const DEFAULT_STRING_MATERIAL = {
    guitar: 'Daddario_guitar_XL',
    bass: 'Daddario_bass_XL',
    other: 'Daddario_other_BanjoXL',
}

export const SERVER_URL = 'https://ideal-strings.onrender.com';

export const DECIMAL_POINTS = 2

export const DEFAULT_SETTINGS = {
    weightedMode: true,
    darkMode: false,
    stringCoeff: 0,
    stringPower: 0,
    useOSTheme: true,
    referencePitch: REFERENCE_PITCH,
    reverseStrings: false,
}

export const DEFAULT_STRING_COUNT = {
    guitar: 6,
    bass: 4,
    other: 4,
}

export const DEFAULT_SCALES = {
    guitar: 25.5,
    bass: 34,
    other: 13,
}

export const INST_PRESETS: InstPreset[] = [
    {
        name: `Guitar 25.5" 10-46 E`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tensions: [16.2, 15.4, 16.6, 18.4, 19.0, 16.9, 15.8, 13.9, 13.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar1-6",
    },
    {
        name: `Guitar 25.5" 12 String`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [12],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 23.4, 16.9, 23.2],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_12
        },
        id: "guitar1-12",
    },
    {
        name: `Guitar 25.5" 10 String`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [10],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 16.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_10
        },
        id: "guitar1-10",
    },
    {
        name: `Guitar 25.5" 11 String`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [11],
        tensions: [16.2, 16.2, 15.4, 15.4, 16.6, 14.7, 18.4, 18.5, 19.0, 23.4, 16.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_11
        },
        id: "guitar1-11",
    },
    {
        name: `Acoustic Guitar 12-53`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tensions: [23.4, 23.3, 30.1, 29.9, 28.9, 24.9, 20.0, 16.0, 14.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "acguitar1-6",
    },
    {
        name: `Acoustic 12 String 10-47`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [12],
        tensions: [16.2, 16.2, 17.8, 17.8, 27.9, 14.7, 26.7, 18.5, 24.7, 23.4, 19.9, 26.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_12
        },
        id: "acguitar1-12",
    },
    {
        name: `Bass 34" 100 E`,
        instrument: "bass",
        scale: 34,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass
        },
        id: "bass1-4",
    },
    {
        name: `Bass 34" 105 E`,
        instrument: "bass",
        scale: 34,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [50.3, 55.6, 45.3, 38.1, 35.0],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass
        },
        id: "bass2-4",
    },
    {
        name: `Bass 30" 105 E`,
        instrument: "bass",
        scale: 30,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [39.2, 43.3, 35.3, 29.6, 27.3],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass
        },
        id: "bass3-4",
    },
    {
        name: `Bass 32" 105 E`,
        instrument: "bass",
        scale: 32,
        forStrings: [1, 2, 3, 4, 5],
        tensions: [44.6, 49.3, 40.2, 33.7, 31.0],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass
        },
        id: "bass4-4",
    },
    {
        name: `Bass 34" 6 String`,
        instrument: "bass",
        scale: 34,
        forStrings: [6],
        tensions: [39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass_6
        },
        id: "bass1-6",
    },
    {
        name: `Bass 34" 7 String`,
        instrument: "bass",
        scale: 34,
        forStrings: [7],
        tensions: [39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass_7
        },
        id: "bass1-7",
    },
    {
        name: `Bass 34" 8 String`,
        instrument: "bass",
        scale: 34,
        forStrings: [8, 10],
        tensions: [42.5, 33.0, 48.4, 37.5, 40.1, 40.8, 34.7, 35.6, 32.1, 36.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass_8
        },
        id: "bass1-8",
    },
    {
        name: `Bass 34" 9 String`,
        instrument: "bass",
        scale: 34,
        forStrings: [9, 11],
        tensions: [30, 39.0, 39.0, 42.5, 48.4, 40.1, 34.7, 32.1, 30, 25, 25],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass_9
        },
        id: "bass1-9",
    },
    {
        name: `Bass 34" 12 String`,
        instrument: "bass",
        scale: 34,
        forStrings: [12],
        tensions: [42.5, 33.0, 33.0, 48.4, 37.5, 37.5, 40.1, 40.8, 40.8, 34.7, 35.6, 35.6, 32.1, 36.1, 36.1],
        tuning: {
            name: "E Standard",
            type: "bass",
            strings: DEFAULT_TUNINGS.bass_12
        },
        id: "bass1-11",
    },
    {
        name: "Banjo G 5 String",
        instrument: "other",
        scale: 26.25,
        forStrings: [5, 6, 7, 9, 11],
        tensions: [16.5, 13.9, 10.3, 14.1, 16.4, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0],
        tuning: {
            name: "Banjo G",
            type: "other",
            strings: DEFAULT_TUNINGS.other_banjo
        },
        id: "banjo1",
    },
    {
        name: "Mandolin G",
        instrument: "other",
        scale: 13.875,
        forStrings: [8, 12],
        tensions: [23.2, 23.2, 19.3, 19.3, 26.5, 26.5, 20.2, 20.2, 20.0, 20.0, 20.0, 20.0],
        tuning: {
            name: "Mandolin",
            type: "other",
            strings: DEFAULT_TUNINGS.other_mandolin
        },
        id: "mandolin1",
    },
    {
        name: `Pedal Steel B9 10 String`,
        instrument: "other",
        scale: 24.25,
        forStrings: [10],
        tensions: [31.2, 29.4, 28.2, 28.8, 23.8, 23.3, 26.3, 28.1, 27.6, 23.8],
        tuning: {
            name: "Pedal Steel E9",
            type: "other",
            strings: DEFAULT_TUNINGS.other_pedalsteel
        },
        id: "pedalsteel1",
    },
    {
        name: "Ukulele Soprano G",
        instrument: "other",
        scale: 13,
        forStrings: [1, 2, 3, 4],
        tensions: [7.5, 5.9, 5.5, 6.4],
        tuning: {
            name: "Ukulele Soprano G",
            type: "other",
            strings: DEFAULT_TUNINGS.other_ukulele
        },
        id: "uke1",
    },
    {
        name: `Classical Guitar 28-43`,
        instrument: "guitar",
        scale: 25.6,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [16.2, 12.0, 11.9, 15.6, 15.9, 14.2, 14.0, 12.0, 10.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "cguitar1",
    },
    {
        name: `Guitar 24.75" 10-46 E`,
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [15.3, 14.5, 15.6, 17.4, 17.9, 15.9, 15.0, 12.3, 10.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar2-6",
    },
    {
        name: `Guitar 25.5" 9-42 E`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [13.1, 11.0, 14.7, 15.7, 15.5, 14.4, 13.3, 13.0, 12.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar3-6",
    },
    {
        name: `Guitar 24.75" 9-42 E`,
        instrument: "guitar",
        scale: 24.75,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [12.4, 10.4, 13.8, 14.8, 14.6, 13.5, 12.5, 10.0, 9.5],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar4-6",
    },
    {
        name: `Guitar 24" 9-42 E`,
        instrument: "guitar",
        scale: 24,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [11.6, 9.8, 13.0, 13.9, 13.7, 12.7, 11.7, 9.4, 9.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar5-6",
    },
    {
        name: `Guitar 24" 10-46 E`,
        instrument: "guitar",
        scale: 24,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [14.4, 13.6, 14.7, 16.3, 16.9, 15.0, 14.1, 11.6, 9.9],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar6-6",
    },
    {
        name: `Guitar 25.5" 12-52 E`,
        instrument: "guitar",
        scale: 25.5,
        forStrings: [3, 4, 5, 6, 7, 8, 9],
        tensions: [23.4, 23.3, 28.0, 27.6, 25.6, 21.1, 21.0, 19.0, 15.0],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar
        },
        id: "guitar7-6",
    },
    {
        name: `Bass VI 30" 84-24 E`,
        instrument: "guitar",
        scale: 30,
        forStrings: [6],
        tensions: [27.4, 30.0, 30.6, 27.7, 25.6, 19.8],
        tuning: {
            name: "E Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.bass_VI
        },
        id: "bassVI1",
    },
    {
        name: `Baritone 27" 14-68 B`,
        instrument: "guitar",
        scale: 27,
        forStrings: [6, 7, 8],
        tensions: [20.0, 18.6, 20.6, 31.2, 28.3, 23.5, 20.2, 16.0],
        tuning: {
            name: "B Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_baritone
        },
        id: "baritone1-6",
    },
    {
        name: `Baritone 27" 13-62 B`,
        instrument: "guitar",
        scale: 27,
        forStrings: [6, 7, 8],
        tensions: [17.3, 16.6, 20.6, 21.3, 19.0, 19.6, 15.3, 13.0],
        tuning: {
            name: "B Standard",
            type: "guitar",
            strings: DEFAULT_TUNINGS.guitar_baritone
        },
        id: "baritone2-6",
    },
]

export const INITIAL_TUNINGS: Tuning[] = [
    {
        id: 'guitar6estandard',
        name: 'E Standard',
        strings: DEFAULT_TUNINGS.guitar.slice(0, 6),
        type: 'guitar',
    },
    {
        id: 'guitar6dropd',
        name: 'Drop D',
        strings: [...DEFAULT_TUNINGS.guitar.slice(0, 5), { note: 'D2', noteValue: NOTES.indexOf('D2') }],
        type: 'guitar',
    },
    {
        id: 'bass4estandard',
        name: 'E Standard',
        strings: DEFAULT_TUNINGS.bass.slice(0, 4),
        type: 'bass',
    },
    {
        id: 'bass5standard',
        name: '5 String Standard',
        strings: DEFAULT_TUNINGS.bass.slice(0, 5),
        type: 'bass',
    },
    {
        id: 'bass4dropd',
        name: 'Drop D',
        strings: [...DEFAULT_TUNINGS.bass.slice(0, 3), { note: 'D1', noteValue: NOTES.indexOf('D1') }],
        type: 'bass',
    },
    {
        id: 'banjo5g',
        name: 'Banjo G',
        strings: DEFAULT_TUNINGS.other_banjo.slice(0, 5),
        type: 'other',
    },
    {
        id: 'mandolin8g',
        name: 'Mandolin G',
        strings: DEFAULT_TUNINGS.other_mandolin.slice(0, 8),
        type: 'other',
    },
    {
        id: 'pedalsteel10b9',
        name: 'Pedal Steel 10 String B9',
        strings: DEFAULT_TUNINGS.other_pedalsteel,
        type: 'other',
    },
]

export const DEFAULT_USER: UserData = {
    username: 'CoolGuy',
    instruments: [],
    tunings: [],
    instPresets: [],
    tensionPresets: [],
    settings: DEFAULT_SETTINGS
}

export const LOCAL_USERDATA_KEY = 'userData'
export const LOCAL_TUNINGS_KEY = 'tunings'
export const LOCAL_INSTS_KEY = 'instruments'

export const MULTISCALE_SPAN = 1.5

export const EXTERNAL_URLS = {
    github: "https://github.com/b-price/tuning-averager",
    benWebsite: "https://bpricedev.com",
    patreon: "https://www.patreon.com/bricedev",
    email: "mailto:bpricedev@gmail.com"
}

export const FAQS = [
    {
        question: `What's this for?`,
        answer: `${APP_NAME} allows you find the best string gauges for your stringed instrument. It lets you find what 
            the average tuning is for all the tunings you use and get a string set to match that. You can input your preferred
            string tension or use the preset tension to calculate the string gauges. Then you can tweak the set, seeing
            instant updates for the string tension of each string.`
    },
    {
        question: `What does 'Target Tension' mean?`,
        answer: `These are the tensions of each string of your instrument, in pounds per inch. Think of it as how tight
            you'd like your strings to be. The higher the number, the tighter the string will be. Higher tension usually
            results in brighter tone and more sustain. You can create your own tension presets or try some common ones in the
            "Use Preset" section of Instrument Input.`
    },
    {
        question: `What is 'Weighted Mode'?`,
        answer: `If weighted mode is on, when the tunings of an instrument are averaged, how often a string is
                    tuned
                    to a note is taken into account. Otherwise, it is not. For example, say you have a guitar with
                    E Standard, Drop D, and E-Flat standard. In weighted mode, the 5th string would be G#2 + 66
                    cents,
                    because A appears twice and G# appears once. If not in weighted mode, the 5th string would be G#2 + 50
                    cents;
                    A is not counted twice.`
    },
    {
        question: `Why should I make an account?`,
        answer: `So you can save all your instruments, tunings, and string sets. You wouldn't wanna lose all that hard work!
            Otherwise, data is saved in your browser in Local Storage.`
    },
    {
        question: `Is ${APP_NAME} free?`,
        answer: `Yes. You can support me at the "Leave me a tip" link below, though.`
    },
    {
        question: `Why'd you make this?`,
        answer: `Good question. I love using many different tunings on my guitars and I wanted something that figured out 
            what string gauges to use. I also always like doing random coding projects!`
    },
    {
        question: `Why don't you have Ernie Ball/etc. strings?`,
        answer: `Of the major manufacturers, only D'Addario and GHS have their string unit weights/tension publicly available.
            I also was able to figure out data for StringJoy and Kalium strings, two smaller custom manufacturers I'd
            highly recommend. You can also tweak the preset tensions of your instrument
            to approximate variations in the materials/manufacturing of strings.`
    },
    {
        question: `Something's broken or messed up!`,
        answer: `You can contact me at the "Contact" link below, thanks!`
    },
    {
        question: `Other? Why don't you have x instrument?`,
        answer: `I might add more explicit support for different instruments in the future, but for now, try the "Use Preset" 
            section of the Instrument Input for some different instruments. Also, you should be
            able to make pretty much anything you can think of with a combination of string count, scale length, and tension.`
    },
    {
        question: `What do the warnings about taper and string length mean?`,
        answer: `Most manufacturers put a taper in strings larger than 65 gauge, so they can fit into tuners. This can cause
            issues if you don't buy the correct length of strings; you don't want a taper on your fretboard! Usually bass
            string sets are marked for their intended scale length with short (S) - 30", medium (M) - 32", long (L) - 34",
            or extra/super long (X or E) - 35+". This can be an issue with the Bass VI as well. On the other hand, it can also
            be an issue to put a string normally intended for a standard scale guitar on one 30+": the string might not be
            long enough. I've found that StringJoy and GHS have the longest and Ernie Ball has the shortest strings.`
    },
    {
        question: `Dark mode/light mode?`,
        answer: `${APP_NAME} uses whatever your system preference is for light or dark themes.`
    },
]

export const EXPORT_TEXT: ExportText = {
    Strings: "Shows how often each string gauge appears in your saved string sets. Good for making bulk string orders!",
    StringSets: "A list of all of your saved string sets and to what instrument they belong.",
    Instruments: "A list of all of your saved instruments.",
    Tunings: "A list of all of your saved tunings.",
}

export const TAPER_WARNING = " usually tapered; be sure to get the right string length. "
export const LENGTH_WARNING = " could be too short for an instrument with scale length "