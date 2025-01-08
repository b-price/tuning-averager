import express from "express";
import bodyParser from "body-parser";
import {Webhook} from "svix";
import {UserData} from "../../types";
import {collections} from "../services/database.service";
import {INST_PRESETS_SERVER} from "../instPresets";

export const webhookRouter = express.Router();

// Clerk webhook for users

webhookRouter.post(
    '/',
    bodyParser.raw({ type: 'application/json' }),
    async function (req, res) {
        try {
            const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;
            if (!SIGNING_SECRET) {
                throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
            }

            const payload = req.body;
            const headers = req.headers;

            // Get Svix headers for verification
            const svix_id = headers['svix-id']
            const svix_timestamp = headers['svix-timestamp']
            const svix_signature = headers['svix-signature']

            // If there are no headers, error out
            if (!svix_id || !svix_timestamp || !svix_signature) {
                return void res.status(400).json({
                    success: false,
                    message: 'Error: Missing svix headers',
                })
            }
            const wh = new Webhook(SIGNING_SECRET);

            let evt

            // Attempt to verify the incoming webhook
            // If successful, the payload will be available from 'evt'
            // If verification fails, error out and return error code
            try {
                evt = wh.verify(payload, {
                    'svix-id': svix_id as string,
                    'svix-timestamp': svix_timestamp as string,
                    'svix-signature': svix_signature as string,
                })


                // @ts-ignore
                const { id, ...attributes } = evt.data;
                // Handle the webhooks
                // @ts-ignore
                const eventType = evt.type;
                if (eventType === 'user.created') {
                    console.log(`User ${id} was ${eventType}`);
                    console.log(attributes);
                    const newUser: UserData = {
                        id: id,
                        username: attributes.username,
                        tunings: [],
                        instruments: [],
                        instPresets: INST_PRESETS_SERVER,
                        tensionPresets: [],
                        settings: {
                            darkMode: false,
                            weightedMode: true,
                            stringCoeff: 0,
                            stringPower: 0,
                            useOSTheme: true,
                        }
                    };
                    const result = await collections?.users?.insertOne(newUser);

                } else if (eventType === 'user.deleted'){
                    const query = { id: id };
                    console.log(`User ${id} was ${eventType} in Clerk, trying Mongo...`);
                    const result = await collections?.users?.deleteOne(query);
                    console.log(`User ${id} was ${eventType}`);

                } else if (eventType === 'user.updated') {
                    const query = { id: id };
                    const update = {username: attributes.username}
                    console.log(`User ${attributes.username} was ${eventType} in Clerk, trying Mongo...`);
                    const result = await collections?.users?.updateOne(query, { $set: update });
                    console.log(`User ${id} was ${eventType}`);
                }

                res.status(200).json({
                    success: true,
                    message: 'Webhook received',
                });
            } catch (err) {
                if (err instanceof Error) {
                    console.log('Error: Could not verify webhook:', err.message)
                    return void res.status(400).json({
                        success: false,
                        message: err.message,
                    })
                }
            }

        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }

        }
    }
);