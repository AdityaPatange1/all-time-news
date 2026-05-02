import Link from "next/link";
import { ObjectId } from "mongodb";
import { ArrowRight, Bookmark, Newspaper, PenSquare } from "lucide-react";
import { getSessionFromCookies } from "@/lib/auth-session";
import { getMongoDb } from "@/lib/mongo-db";
import {
  FAVORITES_COLLECTION,
  POSTS_COLLECTION,
} from "@/lib/db-names";

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  if (!session) return null;

  const db = await getMongoDb();
  const userId = new ObjectId(session.sub);

  const [postsCount, favoritesCount, recentOwn] = await Promise.all([
    db.collection(POSTS_COLLECTION).countDocuments({ userId }),
    db.collection(FAVORITES_COLLECTION).countDocuments({ userId }),
    db
      .collection(POSTS_COLLECTION)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(4)
      .project({ title: 1, createdAt: 1 })
      .toArray(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Snapshot of your syndicate activity—posts authored, signal saved, and
          quick jumps back into the workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-sky-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
            Your posts
          </p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
            {postsCount}
          </p>
          <Link
            href="/console/write"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300"
          >
            Compose new <PenSquare className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/80 p-6 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-200">
            Favourites
          </p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
            {favoritesCount}
          </p>
          <Link
            href="/console/favourites"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-100"
          >
            Review saved items <Bookmark className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/70 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/25">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-200">
            Live desk
          </p>
          <p className="mt-3 text-sm leading-relaxed text-emerald-950 dark:text-emerald-50">
            Feed aggregates every contributor brief with bookmarking tuned for
            rapid triage.
          </p>
          <Link
            href="/console/feed"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100"
          >
            Open feed <Newspaper className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-sky-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent posts by you
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Latest headlines flowing from your desk.
            </p>
          </div>
          <Link
            href="/console/feed"
            className="inline-flex items-center gap-2 rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 dark:border-slate-600 dark:text-sky-200 dark:hover:bg-slate-800"
          >
            View global feed <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-sky-100 dark:divide-slate-800">
          {recentOwn.length === 0 ? (
            <li className="py-6 text-sm text-slate-600 dark:text-slate-400">
              No posts yet—publish your first syndicated brief from the Write
              desk.
            </li>
          ) : (
            recentOwn.map((doc) => (
              <li
                key={doc._id.toString()}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {doc.title}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {doc.createdAt instanceof Date
                    ? doc.createdAt.toLocaleString()
                    : String(doc.createdAt)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
