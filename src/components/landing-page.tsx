"use client";

import { FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BellRing,
  BrainCircuit,
  ChartNoAxesCombined,
  CircleUserRound,
  Feather,
  FileSearch,
  Globe2,
  Handshake,
  Languages,
  Layers,
  MessageCircleQuestion,
  Moon,
  Network,
  PhoneCall,
  Quote,
  RadioTower,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

type ContactPayload = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type ContactField = keyof ContactPayload;
type ContactFieldErrors = Partial<Record<ContactField, string>>;

const features = [
  {
    title: "Geopolitical Intelligence",
    description:
      "Daily briefs built from verified regional signals, diplomacy updates, and strategic context.",
    stat: "24/7 Monitoring",
    icon: Globe2,
  },
  {
    title: "Editorial Verification",
    description:
      "Multi-source validation workflow keeps misinformation out and trusted reporting in.",
    stat: "3-Source Rule",
    icon: ShieldCheck,
  },
  {
    title: "Global Awareness Dashboard",
    description:
      "Topic streams make it easy for readers, educators, and analysts to follow what matters.",
    stat: "Policy + Impact Views",
    icon: Layers,
  },
  {
    title: "Fast Publishing Network",
    description:
      "Cross-continental contributors publish responsibly with strict review checkpoints.",
    stat: "< 7 Min Alert Cycle",
    icon: RadioTower,
  },
  {
    title: "Live Risk Signals",
    description:
      "Detect rapid shifts across border disputes, sanctions, election volatility, and strategic trade routes.",
    stat: "Early Warning Triggers",
    icon: Activity,
  },
  {
    title: "Narrative Intelligence AI",
    description:
      "AI-assisted editorial tooling summarizes developments while keeping source-backed human oversight.",
    stat: "Human-in-the-Loop AI",
    icon: BrainCircuit,
  },
  {
    title: "Multilingual Context Layers",
    description:
      "Bridge language gaps with localized explainers so global communities can interpret events clearly.",
    stat: "Multi-Region Accessibility",
    icon: Languages,
  },
  {
    title: "Institutional Insight Reports",
    description:
      "Weekly strategic reports help enterprises and researchers convert headlines into actionable understanding.",
    stat: "Executive Brief Packs",
    icon: ChartNoAxesCombined,
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
  {
    name: "Nolan Pierce",
    alias: "Crisis Communications Lead, Meridian Group",
    quote:
      "Our teams now align faster because updates include context, risks, and expected trajectories in one place.",
  },
  {
    name: "Aisha Rahman",
    alias: "International Programs Director, Civic Frontier",
    quote:
      "All Time News helps our field teams make informed decisions without getting overwhelmed by fragmented sources.",
  },
  {
    name: "Jonas Keller",
    alias: "Public Affairs Manager, Eastbridge Consortium",
    quote:
      "The platform reads like a trusted analyst briefing, not a noisy feed. That difference is critical for us.",
  },
];

const clients = [
  { name: "Mercedes", logo: "/logos/standard/benz_logo.webp" },
  { name: "Sony", logo: "/logos/standard/sony_logo.webp" },
  { name: "BMW", logo: "/logos/standard/bmw_logo.webp" },
  { name: "TAG Heuer", logo: "/logos/standard/tag_logo.webp" },
  { name: "Rolex", logo: "/logos/standard/rolex_logo.webp" },
  { name: "Unilever", logo: "/logos/standard/unilever_logo.webp" },
  { name: "OpenAI", logo: "/logos/standard/openai_logo.webp" },
  { name: "Anthropic", logo: "/logos/standard/anthropic_logo.webp" },
];

const coverageHighlights = [
  {
    title: "Global Situation Feed",
    detail: "Real-time updates from diplomatic, defense, and economic desks.",
    metric: "60+ regions",
    icon: Globe2,
  },
  {
    title: "Verification Layer",
    detail: "Every alert is reconciled across independent editorial channels.",
    metric: "3-source minimum",
    icon: ShieldCheck,
  },
  {
    title: "Rapid Signal Delivery",
    detail: "Critical changes are dispatched with concise policy impact notes.",
    metric: "< 7 min alerts",
    icon: RadioTower,
  },
];

function Section({
  id,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
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
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-xl border border-sky-200 bg-sky-50 p-2 text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-sky-300/80 via-sky-200/40 to-transparent dark:from-sky-700/70 dark:via-slate-700/40 dark:to-transparent" />
      {subtitle ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

function TestimonialBubble({
  name,
  alias,
  quote,
  align = "left",
}: {
  name: string;
  alias: string;
  quote: string;
  align?: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-md rounded-3xl border p-5 shadow-sm ${
          isRight
            ? "border-sky-200 bg-sky-50/90 dark:border-sky-800 dark:bg-sky-950/40"
            : "border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-900/80"
        }`}
      >
        <div
          className={`absolute top-7 h-3 w-3 rotate-45 border ${
            isRight
              ? "-right-1.5 border-b border-r border-sky-200 bg-sky-50/90 dark:border-sky-800 dark:bg-sky-950/40"
              : "-left-1.5 border-b border-l border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-900/80"
          }`}
          aria-hidden="true"
        />
        <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">
          <Quote className="h-3 w-3" />
          Verified Testimonial
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
          &quot;{quote}&quot;
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <span className="rounded-full bg-sky-100 p-1.5 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200">
            <CircleUserRound className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {alias}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const highlightContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const highlightItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
} as const;

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<ContactField, boolean>>
  >({});
  const [formAvailability, setFormAvailability] = useState<
    "checking" | "available" | "unavailable"
  >("checking");
  const [availabilityMessage, setAvailabilityMessage] = useState(
    "Checking form availability...",
  );

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

  function validateField(name: ContactField, value: string) {
    const trimmed = value.trim();

    if (name === "name") {
      if (trimmed.length < 2) return "Please enter at least 2 characters.";
      if (trimmed.length > 120) return "Name must be within 120 characters.";
      return "";
    }

    if (name === "email") {
      if (!trimmed) return "Email is required.";
      if (trimmed.length > 160) return "Email must be within 160 characters.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
      return "";
    }

    if (name === "organization") {
      if (trimmed.length > 160)
        return "Organization must be within 160 characters.";
      return "";
    }

    if (trimmed.length < 15)
      return "Please provide at least 15 characters for context.";
    if (trimmed.length > 4000) return "Message must be within 4000 characters.";
    return "";
  }

  function validateForm(payload: ContactPayload) {
    const nextErrors: ContactFieldErrors = {};
    (Object.keys(payload) as ContactField[]).forEach((field) => {
      const error = validateField(field, payload[field]);
      if (error) nextErrors[field] = error;
    });
    return nextErrors;
  }

  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;

    async function checkFormAvailability() {
      try {
        const response = await fetch("/api/contact/health", {
          method: "GET",
          cache: "no-store",
        });
        const result = (await response.json()) as {
          available?: boolean;
          error?: string;
        };

        if (cancelled) return;

        if (response.ok && result.available) {
          setFormAvailability("available");
          setAvailabilityMessage("Form is live and ready for submissions.");
          return;
        }

        setFormAvailability("unavailable");
        setAvailabilityMessage(
          result.error ?? "Form is currently unavailable. Please try later.",
        );
      } catch {
        if (cancelled) return;
        setFormAvailability("unavailable");
        setAvailabilityMessage(
          "Form connectivity check failed. Please try again shortly.",
        );
      }
    }

    void checkFormAvailability();
    const interval = setInterval(() => {
      void checkFormAvailability();
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isClient]);

  function onFieldChange(field: ContactField, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));

    if (touchedFields[field]) {
      const nextError = validateField(field, value);
      setFieldErrors((previous) => ({
        ...previous,
        [field]: nextError || undefined,
      }));
    }
  }

  function onFieldBlur(field: ContactField) {
    setTouchedFields((previous) => ({ ...previous, [field]: true }));
    const nextError = validateField(field, form[field]);
    setFieldErrors((previous) => ({
      ...previous,
      [field]: nextError || undefined,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formAvailability !== "available") {
      setStatus("error");
      setSubmissionMessage(
        availabilityMessage || "Form is currently unavailable. Please try later.",
      );
      return;
    }

    const nextErrors = validateForm(form);
    setTouchedFields({
      name: true,
      email: true,
      organization: true,
      message: true,
    });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setSubmissionMessage("Please resolve the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    setSubmissionMessage("");

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
      setSubmissionMessage(
        "Submission received successfully. Our editorial desk will respond within 24 business hours.",
      );
    } catch (submissionError) {
      setStatus("error");
      setSubmissionMessage(
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
            <p className="text-lg font-semibold tracking-tight">
              All Time News
            </p>
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
              All Time News translates global events into verified,
              human-readable intelligence so citizens, organizations, and
              leaders can stay aware and prepared.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white/90 p-6 shadow-lg shadow-sky-200/40 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-sky-900/20"
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20"
              animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                    Coverage Highlights
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Intelligence stream quality
                  </h3>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-full bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200"
                >
                  <TrendingUp className="h-4 w-4" />
                </motion.div>
              </div>

              <motion.ul
                variants={highlightContainer}
                initial="hidden"
                animate="visible"
                className="mt-6 space-y-3"
              >
                {coverageHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.li
                      key={highlight.title}
                      variants={highlightItem}
                      whileHover={{ x: 4 }}
                      className="rounded-2xl border border-sky-200/70 bg-sky-50/70 p-4 transition dark:border-slate-700 dark:bg-slate-800/70"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {highlight.title}
                            </p>
                            <p className="text-xs font-medium text-sky-700 dark:text-sky-300">
                              {highlight.metric}
                            </p>
                          </div>
                          <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">
                            {highlight.detail}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-sky-300/80 bg-white/70 px-4 py-3 text-xs text-slate-600 dark:border-sky-700 dark:bg-slate-900/60 dark:text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live editorial flow active
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300">
                  Explore desks <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <Section
          id="motivation"
          title="Motivation and Honor"
          icon={Feather}
          subtitle="All Time News is built on one belief: informed societies defend democracy, dignity, and peace. We honor journalism by preserving context, reducing noise, and elevating verified truth."
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white/85 p-6 shadow-lg shadow-sky-200/40 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-sky-950/20 sm:p-8"
          >
            <div className="pointer-events-none absolute -left-12 top-8 h-28 w-28 rounded-full bg-sky-200/60 blur-2xl dark:bg-sky-700/30" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-indigo-200/50 blur-2xl dark:bg-indigo-700/20" />

            <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:bg-sky-900/50 dark:text-sky-200">
                  Why this platform exists
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  We turn fast-moving global events into clear, trusted public
                  intelligence.
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
                  <p>
                    All Time News helps people understand geopolitical change
                    without requiring policy expertise. We translate complex
                    developments into structured, evidence-backed reports that
                    explain what happened, why it matters, who is impacted, and
                    what may happen next.
                  </p>
                  <p>
                    Our editorial network combines regional correspondents,
                    verification researchers, and strategic analysts to ensure
                    every brief carries historical context and practical
                    clarity. This enables decision-makers, students,
                    journalists, and citizens to stay informed responsibly.
                  </p>
                  <p>
                    By prioritizing credibility over speed alone, we protect
                    public understanding from misinformation and honor the role
                    of journalism as a force for accountability, empathy, and
                    global cooperation.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.article
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-sky-200/80 bg-sky-50/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/70"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">
                    Editorial Desk
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    &quot;Signal from multiple regions confirmed. Publish with
                    timeline context and civilian impact notes.&quot;
                  </p>
                </motion.article>

                <motion.article
                  whileHover={{ y: -3 }}
                  className="ml-6 rounded-2xl border border-indigo-200/80 bg-indigo-50/80 p-4 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/40"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">
                    Research Cell
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    &quot;Historical comparison added. Policy brief now includes
                    regional dependencies and likely next scenarios.&quot;
                  </p>
                </motion.article>

                <motion.article
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/35"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                    Community Impact
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    &quot;Readers get concise insight cards, source-backed
                    facts, and straightforward explanations they can trust and
                    share.&quot;
                  </p>
                </motion.article>
              </div>
            </div>
          </motion.div>
        </Section>

        <Section
          id="features"
          title="Platform Features"
          icon={Sparkles}
          subtitle="A complete editorial intelligence stack for trustworthy geopolitical reporting, awareness, and action."
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-sky-200/80 bg-white/70 px-4 py-3 text-xs dark:border-slate-700 dark:bg-slate-900/60">
            <p className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Platform stack active across editorial, research, and delivery.
            </p>
            <p className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300">
              Capability map <Network className="h-3.5 w-3.5" />
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={highlightContainer}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                variants={highlightItem}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/70 p-6 transition hover:shadow-lg hover:shadow-sky-200/40 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:shadow-sky-950/30"
              >
                <motion.div
                  className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-sky-300/30 blur-2xl dark:bg-sky-600/20"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.55, 0.3] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-xl bg-white p-2 text-sky-700 shadow-sm dark:bg-slate-800 dark:text-sky-300">
                      <feature.icon className="h-4 w-4" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-900/60 dark:text-sky-300">
                      <FileSearch className="h-3 w-3" />
                      {feature.stat}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 transition group-hover:translate-x-0.5 dark:text-sky-300">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-sky-200 bg-white/80 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <BellRing className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                Alert reliability
              </p>
              <p className="mt-2">
                Critical updates are prioritized with verification confidence
                indicators.
              </p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-white/80 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                Operational visibility
              </p>
              <p className="mt-2">
                Each report includes what changed, when it changed, and
                strategic implications.
              </p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-white/80 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Network className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                Connected insight flow
              </p>
              <p className="mt-2">
                Editorial, research, and distribution teams operate through a
                unified pipeline.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="testimonials"
          title="What Leaders Say"
          icon={MessageCircleQuestion}
          subtitle="Voices from analysts, policy researchers, and strategic communications teams."
        >
          <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-b from-white/90 to-sky-50/70 p-5 shadow-md dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-900/50 sm:p-6">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-dashed border-sky-300/70 bg-white/70 px-4 py-3 text-xs dark:border-sky-800 dark:bg-slate-900/60">
              <p className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Trusted by policy teams, strategic leaders, and global
                researchers.
              </p>
              <p className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300">
                Reader confidence <Handshake className="h-3.5 w-3.5" />
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <TestimonialBubble
                  key={testimonial.name}
                  name={testimonial.name}
                  alias={testimonial.alias}
                  quote={testimonial.quote}
                  align={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="clients"
          title="Trusted by Global Brands"
          icon={Handshake}
          subtitle="Representative enterprise readers and intelligence partners."
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-sky-200/80 bg-white/75 px-4 py-3 text-xs dark:border-slate-700 dark:bg-slate-900/60">
            <p className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Enterprise network partners using All Time News intelligence
              briefs.
            </p>
            <p className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300">
              Verified clients <Handshake className="h-3.5 w-3.5" />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {clients.map((client) => (
              <div
                key={client.name}
                className="group rounded-2xl border border-sky-200 bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="relative flex h-24 items-center justify-center rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/70">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={220}
                    height={120}
                    className="h-full w-full object-contain opacity-80 saturate-0 contrast-110 transition duration-300 group-hover:opacity-100 group-hover:saturate-50 dark:opacity-75 dark:brightness-110 dark:contrast-125"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="contact"
          title="Contact the Editorial Team"
          icon={Send}
          subtitle="Share partnership opportunities, media inquiries, or newsroom collaboration ideas."
        >
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-sky-200 bg-white/85 p-3 shadow-lg shadow-sky-200/35 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-sky-950/20 sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[0.92fr_1.08fr]">
              <aside className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-100 via-sky-50 to-white p-6 dark:border-slate-700 dark:from-sky-950/50 dark:via-slate-900 dark:to-slate-900">
                <div className="pointer-events-none absolute -right-16 -top-10 h-32 w-32 rounded-full bg-sky-300/35 blur-2xl dark:bg-sky-500/25" />
                <div className="relative">
                  <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700 dark:bg-slate-900/70 dark:text-sky-300">
                    Reach Out
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Let us know how we can support your newsroom or enterprise
                    desk.
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
                    We collaborate with public affairs teams, research groups,
                    media organizations, and enterprise strategy units that need
                    reliable geopolitical intelligence.
                  </p>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-sky-200 bg-white/75 p-3 dark:border-slate-700 dark:bg-slate-900/70">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-sky-700 dark:text-sky-300">
                        <Target className="h-3.5 w-3.5" />
                        Typical Inquiry
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        Partnership setup, analyst subscriptions, media
                        collaboration.
                      </p>
                    </div>
                    <div className="rounded-xl border border-sky-200 bg-white/75 p-3 dark:border-slate-700 dark:bg-slate-900/70">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-sky-700 dark:text-sky-300">
                        <PhoneCall className="h-3.5 w-3.5" />
                        Response Window
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        Editorial and partnerships team replies within 24
                        business hours.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              <form
                onSubmit={onSubmit}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6"
                noValidate
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
                    >
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(event) =>
                        onFieldChange("name", event.target.value)
                      }
                      onBlur={() => onFieldBlur("name")}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby="contact-name-error"
                      className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <p
                      id="contact-name-error"
                      className="min-h-5 text-xs text-red-600 dark:text-red-300"
                    >
                      {fieldErrors.name ?? ""}
                    </p>
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
                    >
                      Professional email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(event) =>
                        onFieldChange("email", event.target.value)
                      }
                      onBlur={() => onFieldBlur("email")}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby="contact-email-error"
                      className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <p
                      id="contact-email-error"
                      className="min-h-5 text-xs text-red-600 dark:text-red-300"
                    >
                      {fieldErrors.email ?? ""}
                    </p>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label
                    htmlFor="contact-organization"
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
                  >
                    Organization (optional)
                  </label>
                  <input
                    id="contact-organization"
                    name="organization"
                    type="text"
                    maxLength={160}
                    autoComplete="organization"
                    placeholder="Your organization"
                    value={form.organization}
                    onChange={(event) =>
                      onFieldChange("organization", event.target.value)
                    }
                    onBlur={() => onFieldBlur("organization")}
                    aria-invalid={Boolean(fieldErrors.organization)}
                    aria-describedby="contact-organization-error"
                    className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <p
                    id="contact-organization-error"
                    className="min-h-5 text-xs text-red-600 dark:text-red-300"
                  >
                    {fieldErrors.organization ?? ""}
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
                  >
                    Project brief
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={15}
                    maxLength={4000}
                    placeholder="Tell us about your requirement"
                    rows={6}
                    value={form.message}
                    onChange={(event) =>
                      onFieldChange("message", event.target.value)
                    }
                    onBlur={() => onFieldBlur("message")}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby="contact-message-error"
                    className="rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm outline-none ring-sky-400 focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <p
                    id="contact-message-error"
                    className="min-h-5 text-xs text-red-600 dark:text-red-300"
                  >
                    {fieldErrors.message ?? ""}
                  </p>
                </div>
                <div className="rounded-xl border border-sky-200/80 bg-sky-50/70 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                  <span className="font-semibold">Form status:</span>{" "}
                  {availabilityMessage}
                </div>
                <button
                  type="submit"
                  disabled={
                    status === "loading" || formAvailability !== "available"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  <Send className="h-4 w-4" />
                  {status === "loading"
                    ? "Submitting..."
                    : formAvailability === "checking"
                      ? "Checking availability..."
                      : formAvailability === "unavailable"
                        ? "Form unavailable"
                        : "Send message"}
                </button>

                {status === "success" ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    {submissionMessage}
                  </p>
                ) : null}
                {status === "error" ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {submissionMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </Section>
      </main>

      <footer className="mt-6 border-t border-sky-200/80 bg-white/85 py-8 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 text-sm text-slate-600 sm:px-10 dark:text-slate-300">
          <p>All Time News &trade; Copyright &copy; {year} All Time News.</p>
          <p>All rights reserved.</p>
          <p>Made by Team Wizards Hacker Group.</p>
        </div>
      </footer>
    </div>
  );
}
