"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Moon, Send, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ContactPayload = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

const features = [
  {
    title: "Geopolitical Intelligence",
    description:
      "Daily briefs built from verified regional signals, diplomacy updates, and strategic context.",
  },
  {
    title: "Editorial Verification",
    description:
      "Multi-source validation workflow keeps misinformation out and trusted reporting in.",
  },
  {
    title: "Global Awareness Dashboard",
    description:
      "Topic streams make it easy for readers, educators, and analysts to follow what matters.",
  },
  {
    title: "Fast Publishing Network",
    description:
      "Cross-continental contributors publish responsibly with strict review checkpoints.",
  },
];

const testimonials = [
  {
    name: "Elena Morozov",
    alias: "Policy Intelligence Director, Northline Advisory",
    quote:
      "All Time News helps our team brief executives with calm, factual geopolitics without the noise.",
  },
  {
    name: "Marcus Hale",
    alias: "Head of Strategy, Horizon Civic Labs",
    quote:
      "The trust layer is excellent. We can trace the context behind each major development quickly.",
  },
  {
    name: "Sofia Duran",
    alias: "Global Affairs Research Lead, Vantage Institute",
    quote:
      "Their regional explainers make cross-border news understandable for students and policy teams.",
  },
];

const clients = ["Mercedes", "Sony", "BMW", "TAG Heuer", "Rolex", "Unilever"];

function BrandGlyph({ initials }: { initials: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-12 w-12 text-sky-700 dark:text-sky-300"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="104"
        height="104"
        rx="24"
        className="fill-sky-100/80 stroke-current dark:fill-sky-900/40"
        strokeWidth="3"
      />
      <text
        x="60"
        y="70"
        textAnchor="middle"
        className="fill-current text-[34px] font-semibold"
      >
        {initials}
      </text>
    </svg>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10"
    >
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = isClient && resolvedTheme === "dark";
  const year = useMemo(() => new Date().getFullYear(), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Unable to submit right now.");
      }

      setStatus("success");
      setForm({ name: "", email: "", organization: "", message: "" });
    } catch (submissionError) {
      setStatus("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unexpected error during submission.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-100 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-sky-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
          <div>
            <p className="text-lg font-semibold tracking-tight">All Time News</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Global News Syndicate
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-900/50 dark:text-sky-100 dark:hover:bg-sky-900"
            aria-label="Toggle color mode"
            disabled={!isClient}
          >
            {isClient ? (
              isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {isClient ? (isDark ? "Light mode" : "Dark mode") : "Toggle mode"}
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 sm:px-10 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">
              Trusted global narratives for informed decisions
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Geopolitical clarity for a connected world.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              All Time News translates global events into verified, human-readable
              intelligence so citizens, organizations, and leaders can stay aware
              and prepared.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="rounded-2xl border border-sky-200 bg-white/80 p-6 shadow-lg shadow-sky-200/30 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-sky-900/20"
          >
            <h3 className="text-xl font-semibold">Coverage highlights</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <li>280+ active regional correspondents across 60 countries.</li>
              <li>Editorial validation pipeline in under 7 minutes for alerts.</li>
              <li>Reader-first briefings with policy, impact, and timeline views.</li>
            </ul>
          </motion.div>
        </section>

        <Section
          id="motivation"
          title="Motivation and Honor"
          subtitle="This platform is built on one belief: informed people protect democracy, dignity, and peace. We honor journalism by preserving context, not chasing sensationalism."
        >
          <div className="rounded-2xl border border-sky-200 bg-white/70 p-8 leading-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
            All Time News exists to make reliable geopolitical reporting accessible
            to everyone, not only specialists. Our mission is to amplify
            responsible voices, guard against disinformation, and help global
            communities understand each other with empathy and evidence.
          </div>
        </Section>

        <Section
          id="features"
          title="Platform Features"
          subtitle="A production-ready content pipeline for trustworthy global reporting."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-sky-200 bg-sky-50/70 p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="testimonials"
          title="What Leaders Say"
          subtitle="Voices from analysts, policy researchers, and strategic communications teams."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="rounded-2xl border border-sky-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
              >
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                  &quot;{testimonial.quote}&quot;
                </p>
                <footer className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {testimonial.alias}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>

        <Section
          id="clients"
          title="Trusted by Global Brands"
          subtitle="Representative enterprise readers and intelligence partners."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {clients.map((client) => (
              <div
                key={client}
                className="flex flex-col items-center justify-center rounded-2xl border border-sky-200 bg-white/80 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60"
              >
                <BrandGlyph
                  initials={client
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                />
                <p className="mt-2 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  {client}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="contact"
          title="Contact the Editorial Team"
          subtitle="Share partnership opportunities, media inquiries, or newsroom collaboration ideas."
        >
          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-2xl border border-sky-200 bg-white/85 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            <input
              required
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
            />
            <input
              required
              type="email"
              placeholder="Professional email"
              value={form.email}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, email: event.target.value }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
            />
            <input
              type="text"
              placeholder="Organization"
              value={form.organization}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  organization: event.target.value,
                }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
            />
            <textarea
              required
              placeholder="Your message"
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  message: event.target.value,
                }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              <Send className="h-4 w-4" />
              {status === "loading" ? "Submitting..." : "Send message"}
            </button>

            {status === "success" ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Message received. Our editorial desk will respond shortly.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}
          </form>
        </Section>
      </main>

      <footer className="mt-6 border-t border-sky-200/80 bg-white/85 py-8 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 text-sm text-slate-600 sm:px-10 dark:text-slate-300">
          <p>
            All Time News(TM) | Copyright &copy; {year} All Time News. All rights
            reserved.
          </p>
          <p>Made by Team Wizards Hacker Group.</p>
        </div>
      </footer>
    </div>
  );
}
