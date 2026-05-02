import type { Db } from "mongodb";
import { getMongoClientPromise } from "@/lib/mongodb";
import { getDatabaseName } from "@/lib/db-names";

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(getDatabaseName());
}
