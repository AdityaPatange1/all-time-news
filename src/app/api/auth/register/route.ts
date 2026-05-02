import { NextResponse } from "next/server";
import { z } from "zod";
import { getMongoDb } from "@/lib/mongo-db";
import { USERS_COLLECTION } from "@/lib/db-names";
import { hashPassword } from "@/lib/password";
import { SESSION_MAX_AGE_REMEMBER_SEC } from "@/lib/auth-constants";
import { setSessionCookie, signSessionToken } from "@/lib/auth-session";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid name, email, and password." },
        { status: 400 },
      );
    }

    const emailNormalized = parsed.data.email.trim().toLowerCase();
    const db = await getMongoDb();
    const users = db.collection(USERS_COLLECTION);

    const existing = await users.findOne({ email: emailNormalized });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();
    const insert = await users.insertOne({
      name: parsed.data.name.trim(),
      email: emailNormalized,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    const userId = insert.insertedId.toHexString();
    const token = await signSessionToken(
      {
        sub: userId,
        email: emailNormalized,
        name: parsed.data.name.trim(),
      },
      SESSION_MAX_AGE_REMEMBER_SEC,
    );

    await setSessionCookie(token, SESSION_MAX_AGE_REMEMBER_SEC);

    const response = NextResponse.json({
      ok: true,
      user: {
        id: userId,
        email: emailNormalized,
        name: parsed.data.name.trim(),
      },
    });
    return response;
  } catch (error) {
    console.error("[auth/register]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create account. Please try again." },
      { status: 500 },
    );
  }
}
