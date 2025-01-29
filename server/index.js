"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_service_1 = require("./services/database.service");
const user_router_1 = require("./routes/user.router");
const process = require("node:process");
const tunings_router_1 = require("./routes/tunings.router");
const instruments_router_1 = require("./routes/instruments.router");
const cors_1 = __importDefault(require("cors"));
const webhook_router_1 = require("./routes/webhook.router");
const app = (0, express_1.default)();
const port = 8080;
(0, database_service_1.dbConnect)().then(() => {
    app.use((0, cors_1.default)());
    app.use("/users", user_router_1.userRouter);
    app.use("/tunings", tunings_router_1.tuningsRouter);
    app.use("/instruments", instruments_router_1.instrumentRouter);
    app.use("/api/webhook", webhook_router_1.webhookRouter);
    app.listen(port, () => console.log(`Server running on port: ${port}`));
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});
