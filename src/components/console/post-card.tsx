"use client";

import { useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";

export type FeedPost = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  isFavorite: boolean;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PostCard({
  post,
  onFavoriteChange,
}: {
  post: FeedPost;
  onFavoriteChange?: (id: string, isFavorite: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [favorite, setFavorite] = useState(post.isFavorite);

  async function toggleFavorite() {
    setBusy(true);
    try {
      if (favorite) {
        const res = await fetch(`/api/favorites/${post.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFavorite(false);
          onFavoriteChange?.(post.id, false);
        }
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id }),
        });
        if (res.ok) {
          setFavorite(true);
          onFavoriteChange?.(post.id, true);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-3xl border border-sky-200/80 bg-white/90 p-6 shadow-sm shadow-sky-100/50 transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {post.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {post.authorName} · {formatDate(post.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void toggleFavorite()}
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            favorite
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100"
              : "border-sky-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
          aria-pressed={favorite}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Bookmark
              className="h-3.5 w-3.5"
              fill={favorite ? "currentColor" : "none"}
            />
          )}
          {favorite ? "Saved" : "Save"}
        </button>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {post.body}
      </p>
    </article>
  );
}
