"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function GetStartedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await res.json()) as { authenticated?: boolean };
      if (data.authenticated) {
        router.push("/console/feed");
      } else {
        router.push("/login?next=/console/feed");
      }
    } catch {
      router.push("/login?next=/console/feed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={loading}
      className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:hover:bg-sky-400"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking access…
        </>
      ) : (
        <>
          Get started
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
