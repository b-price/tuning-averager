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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
exports.instrumentRouter = express_1.default.Router();
exports.instrumentRouter.use(express_1.default.json());
exports.instrumentRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const instruments = (yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
        res.status(200).send(instruments);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}));
exports.instrumentRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const instrument = (yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (instrument) {
            res.status(200).send(instrument);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching instrument with id: ${req.params.id}`);
    }
}));
exports.instrumentRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newInstrument = req.body;
        const result = yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _a === void 0 ? void 0 : _a.insertOne(newInstrument));
        result
            ? res.status(201).send({ message: `Successfully inserted instrument with id: ${result.insertedId}`, id: result.insertedId })
            : res.status(500).send("Failed to insert instrument!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.instrumentRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const updatedInstrument = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: updatedInstrument }));
        result
            ? res.status(200).send(`Successfully updated instrument with id ${id}`)
            : res.status(304).send(`Instrument with id: ${id} not updated`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.instrumentRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.instruments) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed instrument with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove instrument with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Instrument with id ${id} does not exist`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
}));
