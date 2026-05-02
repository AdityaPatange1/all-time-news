import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getMongoDb } from "@/lib/mongo-db";
import { USERS_COLLECTION } from "@/lib/db-names";
import { verifyPassword } from "@/lib/password";
import {
  SESSION_MAX_AGE_REMEMBER_SEC,
  SESSION_MAX_AGE_TRANSIENT_SEC,
} from "@/lib/auth-constants";
import { setSessionCookie, signSessionToken } from "@/lib/auth-session";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email and password." },
        { status: 400 },
      );
    }

    const emailNormalized = parsed.data.email.trim().toLowerCase();
    const db = await getMongoDb();
    const users = db.collection(USERS_COLLECTION);

    const user = await users.findOne({ email: emailNormalized });
    if (!user || typeof user.passwordHash !== "string") {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const userId =
      user._id instanceof ObjectId ? user._id.toHexString() : String(user._id);
    const name = typeof user.name === "string" ? user.name : "Member";

    const maxAge = parsed.data.rememberMe
      ? SESSION_MAX_AGE_REMEMBER_SEC
      : SESSION_MAX_AGE_TRANSIENT_SEC;

    const token = await signSessionToken(
      {
        sub: userId,
        email: emailNormalized,
        name,
      },
      maxAge,
    );

    await setSessionCookie(token, maxAge);

    return NextResponse.json({
      ok: true,
      user: {
        id: userId,
        email: emailNormalized,
        name,
      },
    });
  } catch (error) {
    console.error("[auth/login]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to sign in. Please try again." },
      { status: 500 },
    );
  }
}
