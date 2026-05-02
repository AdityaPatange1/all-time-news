import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getMongoDb } from "@/lib/mongo-db";
import { FAVORITES_COLLECTION, POSTS_COLLECTION } from "@/lib/db-names";
import { getSessionFromCookies } from "@/lib/auth-session";
import { escapeRegex } from "@/lib/regex";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const raw = {
      q: url.searchParams.get("q") ?? "",
      limit: url.searchParams.get("limit") ?? undefined,
    };
    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Enter a search query." },
        { status: 400 },
      );
    }

    const safe = escapeRegex(parsed.data.q.trim());
    const session = await getSessionFromCookies();
    const db = await getMongoDb();

    const posts = await db
      .collection(POSTS_COLLECTION)
      .find({
        $or: [
          { title: { $regex: safe, $options: "i" } },
          { body: { $regex: safe, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(parsed.data.limit)
      .project({
        title: 1,
        body: 1,
        authorName: 1,
        userId: 1,
        createdAt: 1,
      })
      .toArray();

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
      query: parsed.data.q.trim(),
      posts: posts.map((p) => ({
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
    console.error("[posts/search]", error);
    return NextResponse.json(
      { ok: false, error: "Search failed." },
      { status: 500 },
    );
  }
}
