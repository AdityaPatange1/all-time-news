import { MongoClient } from "mongodb";

const options = {};

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment configuration.");
  }

  let client: MongoClient;
  let clientPromise: Promise<MongoClient>;

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}
