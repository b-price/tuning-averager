import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import {Instrument} from "../../types";

export const instrumentRouter = express.Router();

instrumentRouter.use(express.json());

instrumentRouter.get("/", async (req, res: Response) => {
    try {
        const instruments = (await collections?.instruments?.find({}).toArray()) as Instrument[];
        res.status(200).send(instruments);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
});

instrumentRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const instrument = (await collections?.instruments?.findOne(query)) as Instrument;

        if (instrument) {
            res.status(200).send(instrument);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

instrumentRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newInstrument = req.body as Instrument;
        const result = await collections?.instruments?.insertOne(newInstrument);

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

instrumentRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedInstrument = req.body as Instrument;
        const query = { _id: new ObjectId(id) };

        const result = await collections?.instruments?.updateOne(query, { $set: updatedInstrument });

        result
            ? res.status(200).send(`Successfully updated instrument with id ${id}`)
            : res.status(304).send(`Instrument with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
});

instrumentRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections?.instruments?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed instrument with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove instrument with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Instrument with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
});