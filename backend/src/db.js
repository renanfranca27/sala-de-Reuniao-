import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DBNAME || 'sala_reuniao';

let client = null;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export async function getCollection(name) {
  const db = await connectDB();
  return db.collection(name);
}

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
  }
}

export { MongoClient };
