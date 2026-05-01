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
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const requestIp = request.headers.get("x-forwarded-for") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  try {
    const json = (await request.json()) as unknown;
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      console.warn(
        `[contact-api] validation_failed ${JSON.stringify({
          requestId,
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
          ip: requestIp,
        })}`,
      );

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
      ip: requestIp,
      userAgent,
      requestId,
    });

    console.info(
      `[contact-api] submission_success ${JSON.stringify({
        requestId,
        email: parsed.data.email,
        organization: parsed.data.organization || "n/a",
        elapsedMs: Date.now() - start,
      })}`,
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(
      `[contact-api] submission_failed ${JSON.stringify({
        requestId,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        elapsedMs: Date.now() - start,
        ip: requestIp,
        userAgent,
      })}`,
    );

    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
