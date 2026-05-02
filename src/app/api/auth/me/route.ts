import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongo-db";
import {
  FAVORITES_COLLECTION,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} from "@/lib/db-names";
import { getSessionFromCookies } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  try {
    const db = await getMongoDb();
    const userId = new ObjectId(session.sub);
    const user = await db.collection(USERS_COLLECTION).findOne(
      { _id: userId },
      { projection: { name: 1, email: 1 } },
    );

    if (!user) {
      return NextResponse.json({ ok: true, authenticated: false });
    }

    const [postsCount, favoritesCount] = await Promise.all([
      db.collection(POSTS_COLLECTION).countDocuments({ userId }),
      db.collection(FAVORITES_COLLECTION).countDocuments({ userId }),
    ]);

    return NextResponse.json({
      ok: true,
      authenticated: true,
      user: {
        id: session.sub,
        email: user.email,
        name: user.name,
        postsCount,
        favoritesCount,
      },
    });
  } catch {
    return NextResponse.json({ ok: true, authenticated: false });
  }
}
