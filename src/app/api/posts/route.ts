import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getMongoDb } from "@/lib/mongo-db";
import {
  FAVORITES_COLLECTION,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} from "@/lib/db-names";
import { getSessionFromCookies } from "@/lib/auth-session";
import { requireUserSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(12000),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get("limit")) || 30),
    );
    const session = await getSessionFromCookies();

    const db = await getMongoDb();
    const posts = db.collection(POSTS_COLLECTION);

    const cursor = posts
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .project({
        title: 1,
        body: 1,
        authorName: 1,
        userId: 1,
        createdAt: 1,
        updatedAt: 1,
      });

    const list = await cursor.toArray();

    let favoriteIds = new Set<string>();
    if (session) {
      const fav = await db
        .collection(FAVORITES_COLLECTION)
        .find({ userId: new ObjectId(session.sub) })
        .project({ postId: 1 })
        .toArray();
      favoriteIds = new Set(
        fav.map((f) =>
          f.postId instanceof ObjectId
            ? f.postId.toHexString()
            : String(f.postId),
        ),
      );
    }

    return NextResponse.json({
      ok: true,
      posts: list.map((p) => ({
        id:
          p._id instanceof ObjectId ? p._id.toHexString() : String(p._id),
        title: p.title,
        body: p.body,
        authorName: p.authorName,
        createdAt: p.createdAt,
        isFavorite: favoriteIds.has(
          p._id instanceof ObjectId ? p._id.toHexString() : String(p._id),
        ),
      })),
    });
  } catch (error) {
    console.error("[posts GET]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load feed." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const ctx = await requireUserSession();
  if ("error" in ctx) return ctx.error;

  try {
    const json = (await request.json()) as unknown;
    const parsed = createPostSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Title and body must meet length requirements." },
        { status: 400 },
      );
    }

    const db = await getMongoDb();
    const user = await db
      .collection(USERS_COLLECTION)
      .findOne({ _id: ctx.userId }, { projection: { name: 1 } });

    const authorName =
      typeof user?.name === "string" ? user.name : ctx.session.name;
    const now = new Date();

    const result = await db.collection(POSTS_COLLECTION).insertOne({
      userId: ctx.userId,
      authorName,
      title: parsed.data.title.trim(),
      body: parsed.data.body.trim(),
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        ok: true,
        post: {
          id: result.insertedId.toHexString(),
          title: parsed.data.title.trim(),
          body: parsed.data.body.trim(),
          authorName,
          createdAt: now,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[posts POST]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to publish post." },
      { status: 500 },
    );
  }
}
