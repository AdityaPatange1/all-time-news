import { ObjectId } from "mongodb";
import { getSessionFromCookies } from "@/lib/auth-session";
import { getMongoDb } from "@/lib/mongo-db";
import { USERS_COLLECTION } from "@/lib/db-names";

export type AuthedContext =
  | { session: { sub: string; email: string; name: string }; userId: ObjectId }
  | { error: Response };

export async function requireUserSession(): Promise<AuthedContext> {
  const session = await getSessionFromCookies();
  if (!session) {
    return {
      error: new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  let userId: ObjectId;
  try {
    userId = new ObjectId(session.sub);
  } catch {
    return {
      error: new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  const db = await getMongoDb();
  const user = await db.collection(USERS_COLLECTION).findOne({ _id: userId });
  if (!user) {
    return {
      error: new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  return { session, userId };
}
