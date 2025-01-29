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
exports.tuningsRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
exports.tuningsRouter = express_1.default.Router();
exports.tuningsRouter.use(express_1.default.json());
exports.tuningsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tunings = (yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
        res.status(200).send(tunings);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}));
exports.tuningsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const tuning = (yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (tuning) {
            res.status(200).send(tuning);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching tuning with id: ${req.params.id}`);
    }
}));
exports.tuningsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newTuning = req.body;
        const result = yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _a === void 0 ? void 0 : _a.insertOne(newTuning));
        result
            ? res.status(201).send({
                message: `Successfully inserted tuning with id: ${result.insertedId}`,
                id: result.insertedId
            })
            : res.status(500).send("Failed to insert tuning!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.tuningsRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const updatedTuning = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: updatedTuning }));
        result
            ? res.status(200).send(`Successfully updated tuning with id ${id}`)
            : res.status(304).send(`Tuning with id: ${id} not updated`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.tuningsRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.tunings) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed tuning with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove tuning with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Tuning with id ${id} does not exist`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
}));
