import express from "express";
import { dbConnect } from "./services/database.service";
import { userRouter } from "./routes/user.router";
import process = require("node:process");
import {tuningsRouter} from "./routes/tunings.router";
import {instrumentRouter} from "./routes/instrumentsRouter";

const app = express();
const port = 8080;

dbConnect().then(() => {
    app.use("/users", userRouter);
    app.use("/tunings", tuningsRouter);
    app.use("/instruments", instrumentRouter);
    app.listen(port, () => console.log(`Server running on port: ${port}`));
}).catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});