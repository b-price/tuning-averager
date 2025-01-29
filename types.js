"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = exports.UserData = exports.Instrument = exports.Tuning = void 0;
class Tuning {
    constructor(name, strings, type, id) {
        this.name = name;
        this.strings = strings;
        this.type = type;
        this.id = id;
    }
}
exports.Tuning = Tuning;
class Instrument {
    constructor(name, strings, tunings, scale, targetTension, type, stringSets, isMultiscale, scales, id) {
        this.name = name;
        this.strings = strings;
        this.tunings = tunings;
        this.scale = scale;
        this.targetTension = targetTension;
        this.type = type;
        this.stringSets = stringSets;
        this.isMultiscale = isMultiscale;
        this.scales = scales;
        this.id = id;
    }
}
exports.Instrument = Instrument;
class UserData {
    constructor(username, instruments, tunings, settings, instPresets, tensionPresets, id) {
        this.username = username;
        this.instruments = instruments;
        this.tunings = tunings;
        this.settings = settings;
        this.instPresets = instPresets;
        this.tensionPresets = tensionPresets;
        this.id = id;
    }
}
exports.UserData = UserData;
class UserSettings {
    constructor(weightedMode, stringCoeff, stringPower, darkMode, useOSTheme, referencePitch) {
        this.weightedMode = weightedMode;
        this.stringCoeff = stringCoeff;
        this.stringPower = stringPower;
        this.darkMode = darkMode;
        this.useOSTheme = useOSTheme;
        this.referencePitch = referencePitch;
    }
}
exports.UserSettings = UserSettings;
