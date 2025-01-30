import * as mongoDB from "mongodb";
import {MongoClient} from "mongodb";
import * as dotenv from "dotenv";
import * as process from "node:process";
import {Instrument, Tuning, UserData} from "../types";

export let collections: {
    users?: mongoDB.Collection<UserData>,
    tunings?: mongoDB.Collection<Tuning>,
    instruments?: mongoDB.Collection<Instrument>,
} = {}

export async function dbConnect() {
    dotenv.config();
    const client = new MongoClient(process.env.MONGODB_URI || '');
    console.log(`Port from env: ${process.env.LISTENING_PORT}`);

    await client.connect()
        .then(() => {
            const db = client.db(process.env.DB_NAME);
            collections.users = db.collection<UserData>(process.env.USER_COLLECTION_NAME || '');
            collections.tunings = db.collection<Tuning>(process.env.TUNINGS_COLLECTION_NAME || '');
            collections.instruments = db.collection<Instrument>(process.env.INSTRUMENTS_COLLECTION_NAME || '');
            console.log(`Successfully connected to database: ${db.databaseName}`);
        })
        .catch(e => console.error(`Could not connect to database: ${e}`));

}
//     try {
//         // Connect the client to the server (optional starting in v4.7)
//
//         // Send a ping to confirm a successful connection
//         // await client.db("data").command({ ping: 1 });
//         // console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// dbConnect().catch(console.dir);