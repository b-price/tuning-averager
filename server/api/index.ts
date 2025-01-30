import express from "express";
import { dbConnect } from "./services/database.service";
import { userRouter } from "./routes/user.router";
import process = require("node:process");
import {tuningsRouter} from "./routes/tunings.router";
import {instrumentRouter} from "./routes/instruments.router";
import cors from "cors";
import {webhookRouter} from "./routes/webhook.router";

const app = express();
const port = process.env.LISTENING_PORT || 8080;

dbConnect().then(() => {
    app.use(cors());
    app.use("/api/users", userRouter);
    app.use("/api/tunings", tuningsRouter);
    app.use("/api/instruments", instrumentRouter);
    app.use("/api/api/webhook", webhookRouter);
    app.listen(8080, () => console.log(`Server running on port: ${port}`));
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});

export default app;