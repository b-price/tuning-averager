import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import {UserData} from "../../types";
import {Webhook} from "svix";
import bodyParser from 'body-parser';

export const userRouter = express.Router();

userRouter.use(express.json());

interface QueryParams {
    field?: string;
    value?: string;
}

userRouter.get("/", async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    const { field, value } = req?.query;

    let users;
    try {
        if (field && value){
            const query = { [field]: value };
            users = (await collections?.users?.findOne(query)) as UserData;
        }
        // else {
        //     users = (await collections?.users?.find({}).toArray()) as UserData[];
        // }
        res.status(200).send(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).send(`Unable to find matching user with username: ${value}`);
        }
    }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { id: id };
        const user = (await collections?.users?.findOne(query)) as UserData;

        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching user with id: ${req.params.id}`);
    }
});

userRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newUser = req.body as UserData;
        const result = await collections?.users?.insertOne(newUser);

        result
            ? res.status(201).send(`Successfully inserted user with id: ${result.insertedId}`)
            : res.status(500).send("Failed to insert user!");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
});

userRouter.patch("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedUser = req.body as UserData;
        const query = { _id: new ObjectId(id) };

        const result = await collections?.users?.updateOne(query, { $set: updatedUser });

        result
            ? res.status(200).send(`Successfully updated user with id ${id}`)
            : res.status(304).send(`User with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
    }
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { id: id };
        const result = await collections?.users?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(400).send(error.message);
        }
    }
});

