import { NextResponse } from "next/server";
import { getMongoClientPromise } from "@/lib/mongodb";

export const runtime = "nodejs";

const databaseName = process.env.MONGODB_DB ?? "all_time_news";

export async function GET() {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  try {
    const client = await getMongoClientPromise();
    await client.db(databaseName).command({ ping: 1 });

    console.info(
      `[contact-health] available ${JSON.stringify({
        requestId,
        elapsedMs: Date.now() - startedAt,
      })}`,
    );

    return NextResponse.json({ ok: true, available: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown health check error";

    console.error(
      `[contact-health] unavailable ${JSON.stringify({
        requestId,
        message,
        elapsedMs: Date.now() - startedAt,
      })}`,
    );

    return NextResponse.json(
      {
        ok: false,
        available: false,
        error: "Form is currently unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
