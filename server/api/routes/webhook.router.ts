import express from "express";
import bodyParser from "body-parser";
import {Webhook} from "svix";
import {Tuning, UserData} from "../types";
import {collections} from "../services/database.service";
import {ObjectId} from "mongodb";
import {TUNING_EXPANSION_IDS} from "../tuningExpansion";

export const webhookRouter = express.Router();

// Clerk webhook for users

webhookRouter.post(
    '/',
    bodyParser.raw({ type: 'application/json' }),
    async function (req, res) {
        try {
            const SIGNING_SECRET = process.env.SIGNING_SECRET;
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
                    console.log(`User ${id} was ${eventType} in Clerk, trying Mongo...`);
                    const userData = attributes.unsafe_metadata.userData ? attributes.unsafe_metadata.userData : null;
                    const tunings: Tuning[] = attributes.unsafe_metadata.tunings.length ? attributes.unsafe_metadata.tunings : [];
                    const instruments = attributes.unsafe_metadata.instruments.length ? attributes.unsafe_metadata.instruments : [];
                    let tuningIDMap: {[tempID: string]: string} = {};
                    let instIDs: string[] = [];
                    if (tunings.length && collections.tunings) {
                        for (const tuning of tunings) {
                            if (tuning.immutable) console.log(tuning.id)
                            const dbTuningID = tuning.immutable ? tuning.id : await collections.tunings.insertOne(tuning)
                                .then(result => result.insertedId.toString())
                                .catch(e => console.log(e));
                            if (dbTuningID && tuning.id) {
                                tuningIDMap[tuning.id] = dbTuningID;
                            }
                        }
                    }
                    const finalInsts = instruments.map((inst: { tunings: any[]; }) => {
                        return {...inst, tunings: inst.tunings.map(tun => tun.id ? tuningIDMap[tun.id] : '')}
                    })

                    if (instruments.length && collections.instruments) {
                        instIDs = await collections.instruments.insertMany(finalInsts)
                            .then(ids => {
                                const ovs = Object.values(ids.insertedIds)
                                console.log(ovs);
                                return ovs.map(id => id.toString())
                            })
                            .catch(e => {
                                console.log(e);
                                return [];
                            });
                    }

                    const newUser: UserData = {
                        id: id,
                        username: attributes.username,
                        tunings: Object.values(tuningIDMap),
                        instruments: instIDs,
                        instPresets: userData ? userData.instPresets : [],
                        tensionPresets: userData ? userData.tensionPresets : [],
                        settings: userData ? userData.settings : {
                            darkMode: false,
                            weightedMode: true,
                            stringCoeff: 0,
                            stringPower: 0,
                            useOSTheme: true,
                            referencePitch: 440,
                            reverseStrings: false,
                            hasTuningExpansion: false,
                        }
                    };
                    const result = await collections?.users?.insertOne(newUser);
                    console.log(`User ${id} was ${eventType}`);

                } else if (eventType === 'user.deleted'){
                    const query = { id: id };
                    console.log(`User ${id} was ${eventType} in Clerk, trying Mongo...`);
                    const userData = await collections?.users?.findOne(query);
                    // Delete the user's tunings and instruments
                    if (userData) {
                        const tuningsFiltered = userData.tunings.filter(t => !TUNING_EXPANSION_IDS.includes(t));
                        const tuningsToDelete = tuningsFiltered.map(t => new ObjectId(t));
                        const instsToDelete = userData.instruments.map(i => new ObjectId(i));
                        const tDeleteResult = tuningsToDelete.length ? await collections?.tunings?.deleteMany({_id: {$in: tuningsToDelete}}) : null;
                        const iDeleteResult = instsToDelete.length ? await collections?.instruments?.deleteMany({_id: {$in: instsToDelete}}) : null;
                        console.log(`User's tunings deleted: ${tDeleteResult ? tDeleteResult : 'none'}`);
                        console.log(`User's instruments deleted: ${iDeleteResult ? iDeleteResult : 'none'}`);
                    }
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