"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { PostCard, type FeedPost } from "@/components/console/post-card";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts?limit=40");
      const data = (await res.json()) as {
        ok?: boolean;
        posts?: FeedPost[];
        error?: string;
      };
      if (!res.ok || !data.ok || !data.posts) {
        throw new Error(data.error ?? "Unable to load feed.");
      }
      setPosts(
        data.posts.map((p) => ({
          ...p,
          createdAt:
            typeof p.createdAt === "string"
              ? p.createdAt
              : new Date(p.createdAt as unknown as string).toISOString(),
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(id);
  }, [load]);

  function handleFavoriteChange(id: string, isFavorite: boolean) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite } : p)),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Live feed
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Syndicated briefs from every verified desk. Bookmark items to keep
            them in your favourites lane.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 disabled:opacity-60 dark:border-slate-600 dark:text-sky-200 dark:hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {error ? (
        <p
          className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-24 text-sm text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading intelligence stream…
        </div>
      ) : (
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-sky-300 bg-white/70 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                The feed is quiet—publish the first brief to seed the network.
              </p>
              <a
                href="/console/write"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/25"
              >
                Write a post
              </a>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onFavoriteChange={handleFavoriteChange}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
