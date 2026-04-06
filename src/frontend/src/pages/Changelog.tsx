import { motion } from "motion/react";
import type { AppPage } from "../App";

interface ChangelogProps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigate: (page: AppPage) => void;
}

const VERSIONS: {
  version: string;
  date: string;
  headline: string;
  changes: string[];
  highlight?: boolean;
}[] = [
  {
    version: "v18",
    date: "Apr 2026",
    headline: "About Us & New Logo",
    highlight: true,
    changes: [
      "Added About Us page with CEO/Founder Samyo Debnath and CFO Ritam Paul",
      "New stylish 'A' logo deployed across sidebar and browser tab",
      "Mission, vision, and values sections added",
    ],
  },
  {
    version: "v17",
    date: "Mar 2026",
    headline: "GluonMode Real AI Vision",
    changes: [
      "GluonMode with COCO-SSD deployed to production",
      "Live camera feed with bounding boxes and object labels",
      "Voice announcements for detected objects",
    ],
  },
  {
    version: "v16",
    date: "Mar 2026",
    headline: "TensorFlow.js Object Detection",
    changes: [
      "TensorFlow.js + COCO-SSD model integrated for real-time in-browser detection",
      "Canvas overlay draws bounding boxes over live video feed",
      "HUD overlay shows top detected objects with confidence percentages",
      "Color-coded status: green (clear) to amber (some objects) to red (danger)",
      "Provider dropdown fixed to show OpenAI instead of OpenAI (ChatGPT)",
    ],
  },
  {
    version: "v15",
    date: "Feb 2026",
    headline: "Meet Aster",
    changes: [
      "Chat assistant now introduces itself as Aster, the Everything Assistant",
      "Header updated to Chat with Aster",
    ],
  },
  {
    version: "v14",
    date: "Feb 2026",
    headline: "Chat Section Live",
    changes: [
      "Dedicated chat interface added to the sidebar navigation",
      "Direct AI conversation with full message history",
      "Mobile bottom nav updated with Chat tab",
    ],
  },
  {
    version: "v13",
    date: "Jan 2026",
    headline: "Major UI Redesign",
    changes: [
      "ChatGPT-style left sidebar (desktop) and bottom tab bar (mobile)",
      "Minimalist dark theme with cyan accent",
      "Bottom-pinned input bar with mic and send buttons",
      "Centered hero greeting with quick-action chips",
    ],
  },
  {
    version: "v12",
    date: "Jan 2026",
    headline: "Multi-Provider AI Support",
    changes: [
      "Admin setup screen now supports OpenAI, Google Gemini, Groq, and Cohere",
      "Free-tier providers (Gemini, Groq, Cohere) available as alternatives",
      "Users can switch providers without code changes",
    ],
  },
  {
    version: "v11",
    date: "Dec 2025",
    headline: "Personalized Greeting & Stability",
    changes: [
      "Personalized greeting feature introduced",
      "Backend stability improvements and task ID consistency fixes",
    ],
  },
  {
    version: "v10",
    date: "Nov 2025",
    headline: "Asteroid Logo & Task ID Fix",
    changes: [
      "Asteroid logo added to browser tab and sidebar header",
      "Task ID handling fully corrected across all frontend and backend files",
      "Complete and delete actions now work reliably",
    ],
  },
  {
    version: "v9",
    date: "Nov 2025",
    headline: "Backend Compile Fixes",
    changes: [
      "Replaced .sort() with Array.sort() throughout backend",
      "Fixed array concatenation using Array.tabulate",
      "All backend compile errors resolved",
    ],
  },
  {
    version: "v8",
    date: "Oct 2025",
    headline: "Critical Bug Fixes",
    changes: [
      "Backend compile errors resolved (missing Int import, comparator)",
      "Settings no longer freezes for new users (getPreferences returns defaults)",
      "Task IDs now match backend Nat keys — no more Task not found errors",
    ],
  },
  {
    version: "v7",
    date: "Oct 2025",
    headline: "Admin Setup Screen",
    changes: [
      "PIN-protected admin screen for secure API key entry",
      "Accessible via Settings → AI Assistant → Setup API Key",
      "PIN: asteroid123",
    ],
  },
  {
    version: "v6",
    date: "Sep 2025",
    headline: "Backend AI Proxy",
    changes: [
      "API key now stored securely in the backend canister",
      "AI features available to all users without exposing the key in the browser",
    ],
  },
  {
    version: "v5",
    date: "Aug 2025",
    headline: "GPT-4o mini Integration",
    changes: [
      "OpenAI GPT-4o mini connected via user-provided API key",
      "AI assistant capable of natural language tasks and reminders",
    ],
  },
  {
    version: "v4",
    date: "Jul 2025",
    headline: "Real Device Integration",
    changes: [
      "Live speech recognition via device microphone",
      "Camera access for GluonMode",
      "GPS and location for NucleusMode navigation",
      "Haptic feedback for key events",
      "Device Permissions panel added",
    ],
  },
  {
    version: "v1–3",
    date: "2025",
    headline: "Initial Builds & Deployments",
    changes: [
      "Core app architecture established",
      "Dashboard, Tasks, Settings pages",
      "Initial Internet Computer deployment",
    ],
  },
];

export default function ChangelogPage({
  onNavigate: _onNavigate,
}: ChangelogProps) {
  return (
    <div
      className="min-h-screen px-5 sm:px-8 pt-8 pb-20"
      aria-label="Changelog page"
      data-ocid="changelog.page"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.82 0.10 195)" }}
          >
            Release History
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-4">
            What&apos;s{" "}
            <span style={{ color: "oklch(0.82 0.10 195)" }}>New</span>
          </h1>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "oklch(0.68 0.006 260)" }}
          >
            Every version of Asteroid, from the initial build to the latest
            release. We ship fast and ship often.
          </p>
        </motion.header>

        {/* Timeline */}
        <section
          aria-label="Version timeline"
          className="relative"
          data-ocid="changelog.list"
        >
          {/* Vertical line */}
          <div
            className="absolute left-[26px] top-2 bottom-2 w-px"
            style={{ backgroundColor: "oklch(0.90 0 0 / 8%)" }}
            aria-hidden
          />

          <div className="flex flex-col gap-0">
            {VERSIONS.map(
              ({ version, date, headline, changes, highlight }, i) => (
                <motion.article
                  key={version}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.04 }}
                  className="relative flex gap-6 pb-8 last:pb-0"
                  aria-label={`Version ${version}: ${headline}`}
                  data-ocid="changelog.item"
                >
                  {/* Dot */}
                  <div className="flex flex-col items-center flex-shrink-0 w-[53px]">
                    <div
                      className="w-[13px] h-[13px] rounded-full mt-[18px] z-10"
                      style={{
                        backgroundColor: highlight
                          ? "oklch(0.82 0.10 195)"
                          : "oklch(0.16 0.004 260)",
                        boxShadow: highlight
                          ? "0 0 12px oklch(0.82 0.10 195 / 40%)"
                          : undefined,
                        border: highlight
                          ? "2px solid oklch(0.82 0.10 195 / 40%)"
                          : "2px solid oklch(0.22 0.004 260)",
                      }}
                      aria-hidden
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl p-5 mt-1"
                    style={{
                      backgroundColor: highlight
                        ? "oklch(0.10 0.004 260)"
                        : "oklch(0.09 0.003 260)",
                      border: highlight
                        ? "1px solid oklch(0.82 0.10 195 / 20%)"
                        : "1px solid oklch(0.90 0 0 / 7%)",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
                        style={{
                          backgroundColor: "oklch(0.82 0.10 195 / 12%)",
                          color: "oklch(0.82 0.10 195)",
                          border: "1px solid oklch(0.82 0.10 195 / 25%)",
                        }}
                      >
                        {version}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.50 0.005 260)" }}
                      >
                        {date}
                      </span>
                      {highlight && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "oklch(0.82 0.10 195)" }}
                        >
                          &#10022; Latest
                        </span>
                      )}
                    </div>

                    <h2 className="font-display font-bold text-base text-foreground mb-3">
                      {headline}
                    </h2>

                    <ul className="flex flex-col gap-1.5">
                      {changes.map((change) => (
                        <li
                          key={change}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "oklch(0.68 0.006 260)" }}
                        >
                          <span
                            className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: "oklch(0.82 0.10 195)" }}
                            aria-hidden
                          />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </section>

        <footer
          className="mt-16 pt-6 text-center"
          style={{ borderTop: "1px solid oklch(0.90 0 0 / 7%)" }}
        >
          <p className="text-xs" style={{ color: "oklch(0.45 0.005 260)" }}>
            &copy; {new Date().getFullYear()}. Built with &#10084;&#65039; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              style={{ color: "oklch(0.55 0.006 260)" }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
