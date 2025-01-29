"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const svix_1 = require("svix");
const database_service_1 = require("../services/database.service");
const mongodb_1 = require("mongodb");
exports.webhookRouter = express_1.default.Router();
// Clerk webhook for users
exports.webhookRouter.post('/', body_parser_1.default.raw({ type: 'application/json' }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;
            if (!SIGNING_SECRET) {
                throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env');
            }
            const payload = req.body;
            const headers = req.headers;
            // Get Svix headers for verification
            const svix_id = headers['svix-id'];
            const svix_timestamp = headers['svix-timestamp'];
            const svix_signature = headers['svix-signature'];
            // If there are no headers, error out
            if (!svix_id || !svix_timestamp || !svix_signature) {
                return void res.status(400).json({
                    success: false,
                    message: 'Error: Missing svix headers',
                });
            }
            const wh = new svix_1.Webhook(SIGNING_SECRET);
            let evt;
            // Attempt to verify the incoming webhook
            // If successful, the payload will be available from 'evt'
            // If verification fails, error out and return error code
            try {
                evt = wh.verify(payload, {
                    'svix-id': svix_id,
                    'svix-timestamp': svix_timestamp,
                    'svix-signature': svix_signature,
                });
                // @ts-ignore
                const _g = evt.data, { id } = _g, attributes = __rest(_g, ["id"]);
                // Handle the webhooks
                // @ts-ignore
                const eventType = evt.type;
                if (eventType === 'user.created') {
                    console.log(`User ${id} was ${eventType} in Clerk, trying Mongo...`);
                    const userData = attributes.unsafe_metadata.userData ? attributes.unsafe_metadata.userData : null;
                    const tunings = attributes.unsafe_metadata.tunings.length ? attributes.unsafe_metadata.tunings : [];
                    const instruments = attributes.unsafe_metadata.instruments.length ? attributes.unsafe_metadata.instruments : [];
                    let tuningIDMap = {};
                    let instIDs = [];
                    if (tunings.length && database_service_1.collections.tunings) {
                        for (const tuning of tunings) {
                            const dbTuningID = yield database_service_1.collections.tunings.insertOne(tuning)
                                .then(result => result.insertedId.toString())
                                .catch(e => console.log(e));
                            if (dbTuningID && tuning.id) {
                                tuningIDMap[tuning.id] = dbTuningID;
                            }
                        }
                    }
                    const finalInsts = instruments.map((inst) => {
                        return Object.assign(Object.assign({}, inst), { tunings: inst.tunings.map(tun => tun.id ? tuningIDMap[tun.id] : '') });
                    });
                    if (instruments.length && database_service_1.collections.instruments) {
                        instIDs = yield database_service_1.collections.instruments.insertMany(finalInsts)
                            .then(ids => {
                            const ovs = Object.values(ids.insertedIds);
                            console.log(ovs);
                            return ovs.map(id => id.toString());
                        })
                            .catch(e => {
                            console.log(e);
                            return [];
                        });
                    }
                    const newUser = {
                        id: id,
                        username: attributes.username,
                        tunings: Object.values(tuningIDMap),
                        instruments: instIDs,
                        instPresets: userData ? userData.instPresets : [],
                        tensionPresets: userData ? userData.tensionPresets : [],
                        settings: userData ? userData.settings : {
                            darkMode: false,
                            weightedMode: true,
                            stringCoeff: 0,
                            stringPower: 0,
                            useOSTheme: true,
                            referencePitch: 440,
                        }
                    };
                    const result = yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.insertOne(newUser));
                    console.log(`User ${id} was ${eventType}`);
                }
                else if (eventType === 'user.deleted') {
                    const query = { id: id };
                    console.log(`User ${id} was ${eventType} in Clerk, trying Mongo...`);
                    const userData = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.findOne(query));
                    // Delete the user's tunings and instruments
                    if (userData) {
                        const tuningsToDelete = userData.tunings.map(t => new mongodb_1.ObjectId(t));
                        const instsToDelete = userData.instruments.map(i => new mongodb_1.ObjectId(i));
                        const tDeleteResult = tuningsToDelete.length ? yield ((_c = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _c === void 0 ? void 0 : _c.deleteMany({ _id: { $in: tuningsToDelete } })) : null;
                        const iDeleteResult = instsToDelete.length ? yield ((_d = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _d === void 0 ? void 0 : _d.deleteMany({ _id: { $in: instsToDelete } })) : null;
                        console.log(`User's tunings deleted: ${tDeleteResult ? tDeleteResult : 'none'}`);
                        console.log(`User's instruments deleted: ${iDeleteResult ? iDeleteResult : 'none'}`);
                    }
                    const result = yield ((_e = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _e === void 0 ? void 0 : _e.deleteOne(query));
                    console.log(`User ${id} was ${eventType}`);
                }
                else if (eventType === 'user.updated') {
                    const query = { id: id };
                    const update = { username: attributes.username };
                    console.log(`User ${attributes.username} was ${eventType} in Clerk, trying Mongo...`);
                    const result = yield ((_f = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _f === void 0 ? void 0 : _f.updateOne(query, { $set: update }));
                    console.log(`User ${id} was ${eventType}`);
                }
                res.status(200).json({
                    success: true,
                    message: 'Webhook received',
                });
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log('Error: Could not verify webhook:', err.message);
                    return void res.status(400).json({
                        success: false,
                        message: err.message,
                    });
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }
        }
    });
});
