import { NextResponse } from "next/server";
import { z } from "zod";
import { getMongoClientPromise } from "@/lib/mongodb";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  organization: z.string().max(160).optional().default(""),
  message: z.string().min(15).max(4000),
});

const databaseName = process.env.MONGODB_DB ?? "all_time_news";
const collectionName = process.env.MONGODB_COLLECTION ?? "contacts";

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please provide valid contact details." },
        { status: 400 },
      );
    }

    const client = await getMongoClientPromise();
    const database = client.db(databaseName);

    await database.collection(collectionName).insertOne({
      ...parsed.data,
      source: "landing-page",
      createdAt: new Date(),
      ip: request.headers.get("x-forwarded-for") ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
