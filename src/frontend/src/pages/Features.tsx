import {
  CheckSquare,
  Eye,
  MapPin,
  MessageSquare,
  Mic,
  Sparkles,
  type Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";

interface FeaturesProps {
  onNavigate: (page: AppPage) => void;
}

const FEATURES: {
  icon: typeof Zap;
  title: string;
  page: AppPage;
  description: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}[] = [
  {
    icon: Sparkles,
    title: "Standard Mode",
    page: "dashboard",
    description:
      "Your AI-powered daily assistant. Manage tasks, set reminders, and get intelligent responses — all from a clean, minimal dashboard designed for hands-free use.",
    accent: "oklch(0.82 0.10 195)",
    accentBg: "oklch(0.82 0.10 195 / 7%)",
    accentBorder: "oklch(0.82 0.10 195 / 18%)",
  },
  {
    icon: Eye,
    title: "GluonMode",
    page: "gravity",
    description:
      "Real-time object detection powered by TensorFlow.js COCO-SSD, running entirely in your browser. Live bounding boxes, HUD overlays, and voice announcements keep you aware of your environment.",
    accent: "oklch(0.70 0.19 45)",
    accentBg: "oklch(0.70 0.19 45 / 7%)",
    accentBorder: "oklch(0.70 0.19 45 / 18%)",
  },
  {
    icon: MapPin,
    title: "NucleusMode",
    page: "earth",
    description:
      "GPS-powered navigation with step-by-step directions. Designed for walking and public spaces, with real-time location tracking and outdoor spatial awareness.",
    accent: "oklch(0.52 0.22 261)",
    accentBg: "oklch(0.52 0.22 261 / 7%)",
    accentBorder: "oklch(0.52 0.22 261 / 18%)",
  },
  {
    icon: Mic,
    title: "Voice Assistant",
    page: "dashboard",
    description:
      "Fully hands-free control via live speech recognition. Speak commands naturally, receive TTS feedback, and operate every feature without touching the screen.",
    accent: "oklch(0.78 0.16 155)",
    accentBg: "oklch(0.78 0.16 155 / 7%)",
    accentBorder: "oklch(0.78 0.16 155 / 18%)",
  },
  {
    icon: MessageSquare,
    title: "Chat with Aster",
    page: "chat",
    description:
      "A dedicated AI conversation interface. Aster — your Everything Assistant — supports OpenAI, Google Gemini, Groq, and Cohere so you can always find a free or low-cost provider.",
    accent: "oklch(0.87 0.16 84)",
    accentBg: "oklch(0.87 0.16 84 / 7%)",
    accentBorder: "oklch(0.87 0.16 84 / 18%)",
  },
  {
    icon: CheckSquare,
    title: "Tasks Manager",
    page: "tasks",
    description:
      "Smart task management with categories, completion tracking, and voice-command support. Add tasks by speaking or typing, and keep your day organized effortlessly.",
    accent: "oklch(0.72 0.18 310)",
    accentBg: "oklch(0.72 0.18 310 / 7%)",
    accentBorder: "oklch(0.72 0.18 310 / 18%)",
  },
];

export default function FeaturesPage({ onNavigate }: FeaturesProps) {
  return (
    <div
      className="min-h-screen px-5 sm:px-8 pt-8 pb-20"
      aria-label="Features page"
      data-ocid="features.page"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "oklch(0.82 0.10 195)" }}
          >
            What Quarq/AI Can Do
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-5">
            Everything you need, <br className="hidden sm:block" />
            <span style={{ color: "oklch(0.82 0.10 195)" }}>
              nothing you don&apos;t
            </span>
          </h1>
          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "oklch(0.68 0.006 260)" }}
          >
            Six tightly integrated modes — each purpose-built to help blind and
            disabled users navigate daily life with confidence and independence.
          </p>
        </motion.header>

        {/* Feature grid */}
        <section
          aria-label="Feature cards"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          data-ocid="features.panel"
        >
          {FEATURES.map(
            (
              {
                icon: Icon,
                title,
                page,
                description,
                accent,
                accentBg,
                accentBorder,
              },
              i,
            ) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.07 }}
                className="flex flex-col rounded-2xl p-6 group"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: "1px solid oklch(0.90 0 0 / 7%)",
                }}
                aria-label={title}
                data-ocid={"features.card"}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    backgroundColor: accentBg,
                    border: `1px solid ${accentBorder}`,
                  }}
                  aria-hidden
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground mb-2">
                  {title}
                </h2>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "oklch(0.68 0.006 260)" }}
                >
                  {description}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate(page)}
                  className="mt-5 flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: accent }}
                  aria-label={`Open ${title}`}
                  data-ocid="features.button"
                >
                  Open <span aria-hidden>&#8594;</span>
                </button>
              </motion.article>
            ),
          )}
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
