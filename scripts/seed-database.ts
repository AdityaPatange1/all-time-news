/**
 * Idempotent seed: generates syndicated-style posts via OpenAI + web search,
 * keyed by stable seedTopicKey so re-runs skip existing topics (no duplicates).
 *
 * Requires: OPENAI_API_KEY, MONGODB_URI (same as app). Optional: OPENAI_SEED_MODEL, SEED_TOPIC_DELAY_MS.
 *
 * Usage: npm run seed-database
 */
import "dotenv/config";

import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import type { Db } from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";
import { GEOPOLITICS_SEED_TOPICS } from "../src/lib/seed-topics";
import {
  POSTS_COLLECTION,
  USERS_COLLECTION,
  getDatabaseName,
} from "../src/lib/db-names";

const SEED_META_ID = "seed_desk_author_v1";
const SEED_USER_EMAIL = "editorial-desk@seed.alltimenews.internal";

const articleSchema = z.object({
  title: z.string().min(3).max(200),
  /** Target ~500 words; minimum length rejects stubs */
  body: z.string().min(1600).max(12000),
});

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v.trim();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArticleJson(raw: string): { title: string; body: string } {
  const trimmed = raw.trim();
  const fence =
    /^```(?:json)?\s*([\s\S]*?)```$/m.exec(trimmed) ??
    /^```\s*([\s\S]*?)```$/m.exec(trimmed);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as unknown;
  return articleSchema.parse(parsed);
}

async function getMongo(): Promise<MongoClient> {
  const uri = requireEnv("MONGODB_URI");
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function getOrCreateSeedAuthorId(db: Db): Promise<ObjectId> {
  const meta = db.collection<{ _id: string; userId?: ObjectId }>("seed_metadata");
  const existingMeta = await meta.findOne({ _id: SEED_META_ID });
  if (existingMeta?.userId) {
    return existingMeta.userId;
  }

  const users = db.collection(USERS_COLLECTION);
  const user = await users.findOne({ email: SEED_USER_EMAIL });
  if (!user) {
    const passwordHash = await bcrypt.hash(randomBytes(40).toString("hex"), 12);
    const now = new Date();
    const inserted = await users.insertOne({
      email: SEED_USER_EMAIL,
      name: "All Time News Desk",
      passwordHash,
      seedSystem: true,
      createdAt: now,
      updatedAt: now,
    });
    await meta.updateOne(
      { _id: SEED_META_ID },
      { $set: { userId: inserted.insertedId, updatedAt: now } },
      { upsert: true },
    );
    return inserted.insertedId;
  }

  const uid = user._id as ObjectId;
  await meta.updateOne(
    { _id: SEED_META_ID },
    { $set: { userId: uid, updatedAt: new Date() } },
    { upsert: true },
  );
  return uid;
}

async function ensureSeedIndexes(db: Db): Promise<void> {
  await db.collection(POSTS_COLLECTION).createIndex(
    { seedTopicKey: 1 },
    { unique: true, sparse: true },
  );
}

async function generateArticle(options: {
  topicLabel: string;
  angle: string;
  modelId: string;
}): Promise<{ title: string; body: string }> {
  const { topicLabel, angle, modelId } = options;

  const system = `You are the syndicated editorial desk for "All Time News". Your premise is that everything is geopolitics: economics, technology, culture, health, and ecology are arenas where states, firms, and societies compete for advantage. Write with analytical clarity; avoid sensationalism; ground claims in current developments when using web search results.`;

  const prompt = `Topic: ${topicLabel}
Editorial angle: ${angle}

Instructions:
1) Use the web_search tool first to gather fresh, real-world signals from roughly the last year relevant to this angle (major outlets, institutions, or official statements).
2) Then write ONE syndicated brief of **about 500 words** (acceptable range 450–600 words).
3) Output **only** valid JSON with exactly two keys, no markdown fences: {"title":"...","body":"..."}
   - title: punchy headline, max 120 characters.
   - body: plain paragraphs separated by \\n\\n only (no markdown headings, bullets, or numbered lists).

JSON only on the final assistant message.`;

  const result = await generateText({
    model: openai(modelId),
    tools: {
      web_search: openai.tools.webSearch({
        externalWebAccess: true,
        searchContextSize: "high",
      }),
    },
    stopWhen: stepCountIs(14),
    maxOutputTokens: 6000,
    temperature: 0.55,
    system,
    prompt,
  });

  const text = result.text?.trim();
  if (!text) {
    throw new Error("Empty model response");
  }

  try {
    return parseArticleJson(text);
  } catch (firstError) {
    const repair = await generateText({
      model: openai(modelId),
      maxOutputTokens: 6000,
      temperature: 0.2,
      prompt: `The previous output failed JSON parsing. Convert the following into ONLY valid JSON with keys "title" and "body". Preserve meaning; ensure body has \\n\\n between paragraphs. No markdown fences.\n\n---\n${text}\n---`,
    });
    const repaired = repair.text?.trim();
    if (!repaired) throw firstError;
    return parseArticleJson(repaired);
  }
}

async function main(): Promise<void> {
  requireEnv("OPENAI_API_KEY");
  const modelId =
    process.env.OPENAI_SEED_MODEL?.trim() || "gpt-4o";
  const delayMs = Math.max(
    0,
    Number.parseInt(process.env.SEED_TOPIC_DELAY_MS ?? "2500", 10) || 2500,
  );

  const client = await getMongo();
  try {
    const db = client.db(getDatabaseName());
    await ensureSeedIndexes(db);
    const authorId = await getOrCreateSeedAuthorId(db);
    const posts = db.collection(POSTS_COLLECTION);

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const topic of GEOPOLITICS_SEED_TOPICS) {
      const exists = await posts.findOne(
        { seedTopicKey: topic.key },
        { projection: { _id: 1 } },
      );
      if (exists) {
        console.info(`[seed] skip (already seeded): ${topic.key}`);
        skipped += 1;
        continue;
      }

      console.info(`[seed] generating: ${topic.key} …`);

      try {
        const { title, body } = await generateArticle({
          topicLabel: topic.label,
          angle: topic.angle,
          modelId,
        });

        const now = new Date();
        try {
          await posts.insertOne({
            userId: authorId,
            authorName: "All Time News Desk",
            title,
            body,
            seedTopicKey: topic.key,
            seedTopicLabel: topic.label,
            createdAt: now,
            updatedAt: now,
          });
          created += 1;
          console.info(`[seed] inserted: ${topic.key}`);
        } catch (insertErr: unknown) {
          const code =
            insertErr && typeof insertErr === "object" && "code" in insertErr
              ? (insertErr as { code?: number }).code
              : undefined;
          if (code === 11000) {
            console.warn(`[seed] duplicate key (race), treating as skip: ${topic.key}`);
            skipped += 1;
          } else {
            throw insertErr;
          }
        }
      } catch (err) {
        failed += 1;
        console.error(`[seed] FAILED ${topic.key}:`, err);
      }

      if (delayMs > 0) {
        await sleep(delayMs);
      }
    }

    console.info(
      `[seed] done. created=${created} skipped=${skipped} failed=${failed}`,
    );
    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await client.close();
  }
}

void main().catch((err) => {
  console.error("[seed] fatal:", err);
  process.exit(1);
});
