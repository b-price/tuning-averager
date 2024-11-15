import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import {Tuning} from "../../types";

export const tuningsRouter = express.Router();

tuningsRouter.use(express.json());

tuningsRouter.get("/", async (req, res: Response) => {
    try {
        const tunings = (await collections?.tunings?.find({}).toArray()) as Tuning[];
        res.status(200).send(tunings);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
});

tuningsRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const tuning = (await collections?.tunings?.findOne(query)) as Tuning;

        if (tuning) {
            res.status(200).send(tuning);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

tuningsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newTuning = req.body as Tuning;
        const result = await collections?.tunings?.insertOne(newTuning);

        result
            ? res.status(201).send(`Successfully inserted document with id: ${result.insertedId}`)
            : res.status(500).send("Failed to insert document!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
});

tuningsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedTuning = req.body as Tuning;
        const query = { _id: new ObjectId(id) };

        const result = await collections?.tunings?.updateOne(query, { $set: updatedTuning });

        result
            ? res.status(200).send(`Successfully updated tuning with id ${id}`)
            : res.status(304).send(`Tuning with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
});

tuningsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections?.tunings?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed tuning with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove tuning with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Tuning with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
});