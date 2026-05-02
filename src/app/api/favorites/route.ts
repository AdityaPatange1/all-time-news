import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getMongoDb } from "@/lib/mongo-db";
import {
  FAVORITES_COLLECTION,
  POSTS_COLLECTION,
} from "@/lib/db-names";
import { requireUserSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";

const bodySchema = z.object({
  postId: z.string().length(24),
});

export async function GET() {
  const ctx = await requireUserSession();
  if ("error" in ctx) return ctx.error;

  try {
    const db = await getMongoDb();
    const favCol = db.collection(FAVORITES_COLLECTION);
    const favorites = await favCol
      .find({ userId: ctx.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const postIds = favorites
      .map((f) => f.postId)
      .filter((id): id is ObjectId => id instanceof ObjectId);

    if (postIds.length === 0) {
      return NextResponse.json({ ok: true, posts: [] });
    }

    const posts = await db
      .collection(POSTS_COLLECTION)
      .find({ _id: { $in: postIds } })
      .project({
        title: 1,
        body: 1,
        authorName: 1,
        createdAt: 1,
      })
      .toArray();

    const order = new Map(postIds.map((id, i) => [id.toHexString(), i]));
    posts.sort(
      (a, b) =>
        (order.get(
          a._id instanceof ObjectId ? a._id.toHexString() : String(a._id),
        ) ?? 0) -
        (order.get(
          b._id instanceof ObjectId ? b._id.toHexString() : String(b._id),
        ) ?? 0),
    );

    return NextResponse.json({
      ok: true,
      posts: posts.map((p) => ({
        id:
          p._id instanceof ObjectId ? p._id.toHexString() : String(p._id),
        title: p.title,
        body: p.body,
        authorName: p.authorName,
        createdAt: p.createdAt,
        isFavorite: true,
      })),
    });
  } catch (error) {
    console.error("[favorites GET]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load favourites." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const ctx = await requireUserSession();
  if ("error" in ctx) return ctx.error;

  try {
    const json = (await request.json()) as unknown;
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid post reference." },
        { status: 400 },
      );
    }

    let postId: ObjectId;
    try {
      postId = new ObjectId(parsed.data.postId);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid post reference." },
        { status: 400 },
      );
    }

    const db = await getMongoDb();
    const post = await db
      .collection(POSTS_COLLECTION)
      .findOne({ _id: postId });
    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Post not found." },
        { status: 404 },
      );
    }

    await db.collection(FAVORITES_COLLECTION).updateOne(
      { userId: ctx.userId, postId },
      {
        $setOnInsert: {
          userId: ctx.userId,
          postId,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[favorites POST]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save favourite." },
      { status: 500 },
    );
  }
}
