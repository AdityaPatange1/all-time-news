import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongo-db";
import { FAVORITES_COLLECTION } from "@/lib/db-names";
import { requireUserSession } from "@/lib/auth-helpers";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ postId: string }> };

export async function DELETE(_request: Request, context: RouteParams) {
  const ctx = await requireUserSession();
  if ("error" in ctx) return ctx.error;

  const { postId: raw } = await context.params;
  let postId: ObjectId;
  try {
    postId = new ObjectId(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid post reference." },
      { status: 400 },
    );
  }

  try {
    const db = await getMongoDb();
    await db.collection(FAVORITES_COLLECTION).deleteOne({
      userId: ctx.userId,
      postId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[favorites DELETE]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to remove favourite." },
      { status: 500 },
    );
  }
}
