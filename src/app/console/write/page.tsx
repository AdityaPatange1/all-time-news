"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to publish.");
        return;
      }
      router.push("/console/feed");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Write post
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Publish concise geopolitical briefs. Minimum 10 characters in the body.
          Your name appears as the byline automatically.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-3xl border border-sky-200/80 bg-white/90 p-6 shadow-lg shadow-sky-100/40 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-slate-800 dark:text-slate-100"
          >
            Headline
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={200}
            className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm outline-none ring-sky-400/30 focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Border corridor developments stabilize trade lanes"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="body"
            className="text-sm font-medium text-slate-800 dark:text-slate-100"
          >
            Brief body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={10}
            maxLength={12000}
            rows={12}
            className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none ring-sky-400/30 focus:border-sky-400 focus:ring-4 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Explain what happened, who is impacted, and what to monitor next."
          />
        </div>

        {message ? (
          <p
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
            role="alert"
          >
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publishing pushes to the global feed instantly.
          </p>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                Publish to feed
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
