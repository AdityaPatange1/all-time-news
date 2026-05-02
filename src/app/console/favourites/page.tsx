"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, Loader2, RefreshCw } from "lucide-react";
import { PostCard, type FeedPost } from "@/components/console/post-card";

export default function FavouritesPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/favorites");
      const data = (await res.json()) as {
        ok?: boolean;
        posts?: FeedPost[];
        error?: string;
      };
      if (!res.ok || !data.ok || !data.posts) {
        throw new Error(data.error ?? "Unable to load favourites.");
      }
      setPosts(
        data.posts.map((p) => ({
          ...p,
          isFavorite: true,
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
    if (!isFavorite) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Favourites
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Briefs you have bookmarked for follow-up. Removing a bookmark drops it
            from this lane but keeps it in the global feed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-50 disabled:opacity-60 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-950/40"
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
          Gathering saved briefs…
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/60 px-6 py-16 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
          <Bookmark className="mx-auto h-8 w-8 text-amber-700 dark:text-amber-200" />
          <p className="mt-4 text-sm font-medium text-amber-950 dark:text-amber-50">
            No favourites yet. Tap “Save” on any feed item to pin it here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
