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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
exports.userRouter = express_1.default.Router();
exports.userRouter.use(express_1.default.json());
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { field, value } = req === null || req === void 0 ? void 0 : req.query;
    let users;
    try {
        if (field && value) {
            const query = { [field]: value };
            users = (yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query)));
        }
        // else {
        //     users = (await collections?.users?.find({}).toArray()) as UserData[];
        // }
        res.status(200).send(users);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).send(`Unable to find matching user with username: ${value}`);
        }
    }
}));
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { id: id };
        const user = (yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send(`Unable to find matching user with id: ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching user with id: ${req.params.id}`);
    }
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newUser = req.body;
        const result = yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.insertOne(newUser));
        result
            ? res.status(201).send(`Successfully inserted user with id: ${result.insertedId}`)
            : res.status(500).send("Failed to insert user!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.userRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const updatedUser = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        console.log(updatedUser.tunings);
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: updatedUser }));
        result
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(304).send(`User with id: ${id} not updated`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
}));
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { id: id };
        const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
}));
