import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Key, Mic, Shield, Wifi } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";
import AsteroidLogo from "../components/AsteroidLogo";

interface HelpProps {
  onNavigate: (page: AppPage) => void;
}

const STEPS = [
  {
    number: "01",
    icon: "🚀",
    title: "Open the App",
    body: "Asteroid runs entirely in your browser — no install needed. Chrome or Safari on mobile gives you full camera, mic, and GPS access.",
  },
  {
    number: "02",
    icon: "🔑",
    title: "Setup Your AI Key",
    body: "Go to Settings → AI Assistant → Setup API Key, enter PIN asteroid123, choose a provider (Gemini or Groq are free), and paste your key.",
  },
  {
    number: "03",
    icon: "🎤",
    title: "Start Talking or Typing",
    body: 'Tap the mic button on the dashboard to speak, or type into the message bar. Try "add task buy groceries" or "open chat".',
  },
];

const FAQS = [
  {
    question: "How do I set up the AI?",
    answer:
      "Go to Settings → AI Assistant → Setup API Key. Enter the PIN asteroid123, select your preferred provider (Gemini or Groq both have free tiers), and paste your API key. The key is stored securely in the backend canister — it never touches your browser.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Chrome and Safari on mobile provide full support for the camera, microphone, and GPS features. Desktop Chrome and Firefox work for most features. For the best GravityMode and EarthMode experience, use Chrome on Android or Safari on iOS.",
  },
  {
    question: "How does GravityMode work?",
    answer:
      "GravityMode uses TensorFlow.js with the COCO-SSD model to run real-time object detection entirely in your browser — no server required. It detects 80+ object types (people, furniture, vehicles, and more), draws bounding boxes on the live camera feed, and announces newly detected objects via voice.",
  },
  {
    question: "How do I add tasks?",
    answer:
      'Type "add task [name]" into the dashboard message bar, or say it aloud with the mic button active. You can also go directly to the Tasks page to add, complete, or delete tasks manually.',
  },
  {
    question: "What voice commands can I use?",
    answer:
      'Supported commands include: "add task [name]", "start GravityMode", "start EarthMode", "open chat", "open settings", and plain natural language questions. The AI assistant understands conversational phrasing too — just speak naturally.',
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Asteroid runs on the Internet Computer blockchain. Your AI API key is stored in the backend canister and is never exposed to the browser or third parties. Task data is stored on-chain and is only accessible to you.",
  },
  {
    question: "Can I use Asteroid offline?",
    answer:
      "Core features like tasks and the navigation UI work offline. AI chat requires an active internet connection. The COCO-SSD model for GravityMode needs to download once on first use (about 5 MB), then it runs entirely on your device.",
  },
  {
    question: "How do I get a free AI key?",
    answer:
      "Two great options: Google Gemini at aistudio.google.com — free tier, no credit card needed, takes about 2 minutes. Groq at console.groq.com — free tier with fast inference on open models (Llama 3, Mixtral). Both work immediately with the Asteroid admin setup screen.",
  },
];

const STAT_ICONS = [Mic, Key, Shield, Wifi];

export default function HelpPage({ onNavigate }: HelpProps) {
  return (
    <div
      className="min-h-screen px-5 sm:px-8 pt-8 pb-20"
      aria-label="Help page"
      data-ocid="help.page"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="mb-6">
            <AsteroidLogo size={48} />
          </div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.82 0.10 195)" }}
          >
            Support
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-4">
            How can we{" "}
            <span style={{ color: "oklch(0.82 0.10 195)" }}>help?</span>
          </h1>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "oklch(0.68 0.006 260)" }}
          >
            Everything you need to get started, troubleshoot, and make the most
            of Asteroid.
          </p>
        </motion.header>

        {/* Getting Started */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
          aria-labelledby="getting-started-heading"
          data-ocid="help.section"
        >
          <h2
            id="getting-started-heading"
            className="font-display font-bold text-2xl text-foreground mb-6"
          >
            Getting Started
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {STEPS.map(({ number, icon, title, body }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex-1 rounded-2xl p-5"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: "1px solid oklch(0.90 0 0 / 7%)",
                }}
                data-ocid="help.card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold tabular-nums tracking-wider"
                    style={{ color: "oklch(0.82 0.10 195)" }}
                  >
                    {number}
                  </span>
                  <span className="text-lg" aria-hidden>
                    {icon}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-foreground mb-2">
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.68 0.006 260)" }}
                >
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.82 0.10 195 / 10%)",
                border: "1px solid oklch(0.82 0.10 195 / 25%)",
                color: "oklch(0.82 0.10 195)",
              }}
              aria-label="Go to Settings"
              data-ocid="help.button"
            >
              Open Settings &#8594;
            </button>
            <button
              type="button"
              onClick={() => onNavigate("chat")}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.09 0.003 260)",
                border: "1px solid oklch(0.90 0 0 / 10%)",
                color: "oklch(0.68 0.006 260)",
              }}
              aria-label="Open Chat"
              data-ocid="help.secondary_button"
            >
              Try Chat with Aster &#8594;
            </button>
          </div>
        </motion.section>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12"
        >
          {[
            { label: "Voice Commands", sublabel: "Speak naturally" },
            { label: "Free AI Keys", sublabel: "Gemini & Groq" },
            { label: "Private & Secure", sublabel: "On-chain storage" },
            { label: "Works Offline", sublabel: "Core features" },
          ].map(({ label, sublabel }, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div
                key={label}
                className="rounded-xl p-4 flex flex-col items-center text-center gap-2"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: "1px solid oklch(0.90 0 0 / 7%)",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: "oklch(0.82 0.10 195)" }}
                  aria-hidden
                />
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {label}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "oklch(0.55 0.006 260)" }}
                >
                  {sublabel}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-labelledby="faq-heading"
          data-ocid="help.section"
        >
          <h2
            id="faq-heading"
            className="font-display font-bold text-2xl text-foreground mb-6"
          >
            Frequently Asked Questions
          </h2>
          <Accordion
            type="multiple"
            className="flex flex-col gap-2"
            data-ocid="help.panel"
          >
            {FAQS.map(({ question, answer }, i) => (
              <AccordionItem
                key={question}
                value={`faq-${i}`}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: "1px solid oklch(0.90 0 0 / 7%)",
                }}
                data-ocid="help.item"
              >
                <AccordionTrigger
                  className="px-5 py-4 text-sm font-semibold text-foreground hover:no-underline hover:text-foreground text-left"
                  data-ocid="help.toggle"
                >
                  {question}
                </AccordionTrigger>
                <AccordionContent
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ color: "oklch(0.68 0.006 260)" }}
                >
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

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
