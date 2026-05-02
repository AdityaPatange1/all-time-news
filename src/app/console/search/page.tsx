"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { PostCard, type FeedPost } from "@/components/console/post-card";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 320);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = useMemo(() => debounced.trim(), [debounced]);

  const runSearch = useCallback(async () => {
    if (trimmed.length < 2) {
      setPosts([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: trimmed, limit: "25" });
      const res = await fetch(`/api/posts/search?${params.toString()}`);
      const data = (await res.json()) as {
        ok?: boolean;
        posts?: FeedPost[];
        error?: string;
      };
      if (!res.ok || !data.ok || !data.posts) {
        throw new Error(data.error ?? "Search failed.");
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
  }, [trimmed]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void runSearch();
    });
    return () => cancelAnimationFrame(id);
  }, [runSearch]);

  function handleFavoriteChange(id: string, isFavorite: boolean) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite } : p)),
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Search news
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Query headlines and brief bodies across the syndicated archive.
          Results refresh as you type (minimum two characters).
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600 dark:text-sky-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sanctions, humanitarian corridor, election monitors…"
          className="w-full rounded-full border border-sky-200 bg-white py-3 pl-12 pr-4 text-sm shadow-inner outline-none ring-sky-400/30 focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950"
          aria-label="Search posts"
        />
        {loading ? (
          <Loader2 className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-sky-600 dark:text-sky-400" />
        ) : null}
      </div>

      {error ? (
        <p
          className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {trimmed.length > 0 && trimmed.length < 2 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter at least two characters to search.
        </p>
      ) : null}

      <div className="space-y-5">
        {trimmed.length >= 2 && posts.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-sky-300 bg-white/70 px-6 py-12 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No briefs matched that query yet.
          </div>
        ) : null}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  );
}
