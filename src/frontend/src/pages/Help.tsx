import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  Key,
  Mic,
  Phone,
  PhoneCall,
  Shield,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
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
    body: "Quarq/AI runs entirely in your browser — no install needed. Chrome or Safari on mobile gives you full camera, mic, and GPS access.",
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
      "Yes. Quarq/AI runs on the Internet Computer blockchain. Your AI API key is stored in the backend canister and is never exposed to the browser or third parties. Task data is stored on-chain and is only accessible to you.",
  },
  {
    question: "Can I use Quarq/AI offline?",
    answer:
      "Core features like tasks and the navigation UI work offline. AI chat requires an active internet connection. The COCO-SSD model for GravityMode needs to download once on first use (about 5 MB), then it runs entirely on your device.",
  },
  {
    question: "How do I get a free AI key?",
    answer:
      "Two great options: Google Gemini at aistudio.google.com — free tier, no credit card needed, takes about 2 minutes. Groq at console.groq.com — free tier with fast inference on open models (Llama 3, Mixtral). Both work immediately with the Quarq/AI admin setup screen.",
  },
  {
    question: "Does Quarq/AI support SambaNova AI?",
    answer:
      "SambaNova integration is planned for a future update. Currently the app supports OpenAI, Google Gemini, Groq, and Cohere — all of which have free tiers.",
  },
  {
    question: "How do I get the most out of GravityMode?",
    answer:
      "Hold your phone at chest height pointing forward for the best field of view. Make sure you're in a well-lit environment for accurate detection. The model detects 80+ object types including people, furniture, and vehicles. Voice announcements will tell you what's detected so you don't need to look at the screen.",
  },
  {
    question: "How does EarthMode help with navigation?",
    answer:
      "EarthMode uses your device GPS to provide step-by-step walking directions. Grant location permission when prompted. It works best outdoors in open spaces. Use it alongside a white cane or guide dog — it's a supplement, not a replacement.",
  },
  {
    question: "What is Offline Mode in Chat?",
    answer:
      "Offline Mode uses a built-in rule-based AI engine with over 10,000 scenarios — no internet or API key needed. Toggle it with the ONLINE/OFFLINE switch in the Chat header. It covers work tasks, household help, cooking, health, finance, travel, tech support, and more.",
  },
];

const EMERGENCY_CONTACTS = [
  { label: "Police", number: "100", icon: "🚔", color: "oklch(0.60 0.20 260)" },
  {
    label: "Ambulance",
    number: "108",
    icon: "🚑",
    color: "oklch(0.60 0.22 155)",
  },
  {
    label: "Fire Brigade",
    number: "101",
    icon: "🚒",
    color: "oklch(0.60 0.22 35)",
  },
  {
    label: "SOS Contact",
    number: "+91 9836333393",
    icon: "📞",
    color: "oklch(0.55 0.25 20)",
  },
];

const VOICE_COMMANDS = [
  { command: "add task [name]", description: "Add a new task" },
  { command: "open chat", description: "Open Aster chat" },
  {
    command: "start GravityMode",
    description: "Launch camera obstacle detection",
  },
  { command: "start EarthMode", description: "Launch GPS navigation" },
  { command: "open settings", description: "Go to Settings" },
  { command: "help", description: "Open this Help page" },
  {
    command: "[any natural language]",
    description: "AI understands conversational phrasing",
  },
];

const STAT_ICONS = [Mic, Key, Shield, Wifi];

export default function HelpPage({ onNavigate }: HelpProps) {
  const [sosState, setSosState] = useState<"idle" | "confirming" | "calling">(
    "idle",
  );
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (sosState !== "confirming") return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSosState("calling");
          window.open("tel:+919836333393");
          setTimeout(() => setSosState("idle"), 4000);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sosState]);

  const handleSOSConfirm = () => {
    setSosState("calling");
    window.open("tel:+919836333393");
    setTimeout(() => setSosState("idle"), 4000);
  };

  return (
    <div
      className="min-h-screen px-5 sm:px-8 pt-8 pb-20"
      aria-label="Help page"
      data-ocid="help.page"
    >
      {/* SOS Confirm Modal Overlay */}
      <AnimatePresence>
        {sosState === "confirming" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "oklch(0.05 0.003 260 / 85%)",
            }}
            data-ocid="help.modal"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 260 }}
              className="mx-4 max-w-sm w-full rounded-2xl p-6"
              style={{
                backgroundColor: "oklch(0.10 0.003 260)",
                border: "2px solid oklch(0.55 0.25 20 / 60%)",
                boxShadow: "0 0 40px oklch(0.55 0.25 20 / 30%)",
              }}
            >
              {/* Warning header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.55 0.25 20 / 20%)" }}
                >
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: "oklch(0.65 0.25 20)" }}
                  />
                </div>
                <h2
                  className="font-bold text-lg"
                  style={{ color: "oklch(0.85 0.15 20)" }}
                >
                  Confirm Emergency Call
                </h2>
              </div>

              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "oklch(0.75 0.01 260)" }}
              >
                This will call{" "}
                <strong style={{ color: "oklch(0.85 0.15 20)" }}>
                  +91 9836333393
                </strong>{" "}
                immediately. Are you sure?
              </p>

              {/* Countdown */}
              <div
                className="flex items-center justify-center rounded-xl py-3 mb-6"
                style={{
                  backgroundColor: "oklch(0.55 0.25 20 / 10%)",
                  border: "1px solid oklch(0.55 0.25 20 / 25%)",
                }}
              >
                <span
                  className="text-sm font-mono"
                  style={{ color: "oklch(0.68 0.006 260)" }}
                >
                  Auto-calling in{" "}
                </span>
                <span
                  className="text-2xl font-bold font-mono ml-2"
                  style={{ color: "oklch(0.65 0.25 20)" }}
                >
                  {countdown}
                </span>
                <span
                  className="text-sm font-mono ml-1"
                  style={{ color: "oklch(0.68 0.006 260)" }}
                >
                  s
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSosState("idle")}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "oklch(0.15 0.003 260)",
                    border: "1px solid oklch(0.90 0 0 / 15%)",
                    color: "oklch(0.68 0.006 260)",
                  }}
                  data-ocid="help.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSOSConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "oklch(0.50 0.25 20)",
                    color: "oklch(0.98 0.005 20)",
                  }}
                  data-ocid="help.confirm_button"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            of Quarq/AI.
          </p>
        </motion.header>

        {/* SOS Emergency Button */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
          aria-labelledby="sos-heading"
          data-ocid="help.section"
        >
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "oklch(0.08 0.008 20)",
              border: "1px solid oklch(0.55 0.25 20 / 30%)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
              <div>
                <h2
                  id="sos-heading"
                  className="font-bold text-xl mb-1"
                  style={{ color: "oklch(0.85 0.15 20)" }}
                >
                  Emergency SOS
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.62 0.01 260)" }}
                >
                  Instantly contact emergency services or your designated SOS
                  contact.
                </p>
              </div>
            </div>

            {/* SOS Button */}
            <AnimatePresence mode="wait">
              {sosState === "idle" && (
                <motion.button
                  key="sos-idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  type="button"
                  onClick={() => setSosState("confirming")}
                  aria-label="Emergency SOS button"
                  data-ocid="help.primary_button"
                  className="w-full flex items-center justify-center gap-3 rounded-2xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    minHeight: "72px",
                    backgroundColor: "oklch(0.50 0.25 20)",
                    color: "oklch(0.98 0.005 20)",
                    animation: "sos-pulse 1.8s ease-in-out infinite",
                  }}
                >
                  <AlertTriangle className="w-6 h-6" aria-hidden />
                  SOS — EMERGENCY
                </motion.button>
              )}

              {sosState === "calling" && (
                <motion.div
                  key="sos-calling"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl font-bold text-lg"
                  style={{
                    minHeight: "72px",
                    backgroundColor: "oklch(0.50 0.25 20 / 30%)",
                    border: "2px solid oklch(0.55 0.25 20 / 50%)",
                    color: "oklch(0.85 0.15 20)",
                  }}
                >
                  <PhoneCall className="w-6 h-6 animate-pulse" aria-hidden />
                  Calling +91 9836333393...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Emergency Contacts Grid */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
          aria-labelledby="emergency-contacts-heading"
          data-ocid="help.section"
        >
          <h2
            id="emergency-contacts-heading"
            className="font-display font-bold text-2xl text-foreground mb-5"
          >
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EMERGENCY_CONTACTS.map(({ label, number, icon, color }, i) => (
              <motion.a
                key={label}
                href={`tel:${number.replace(/\s/g, "")}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.07 }}
                className="flex flex-col items-center text-center gap-2 rounded-2xl p-4 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer no-underline"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: `1px solid ${color}30`,
                  textDecoration: "none",
                }}
                aria-label={`Call ${label} — ${number}`}
                data-ocid={`help.item.${i + 1}`}
              >
                <span className="text-3xl" aria-hidden>
                  {icon}
                </span>
                <span className="font-bold text-sm text-foreground">
                  {label}
                </span>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color }}
                >
                  {number}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider flex items-center gap-1"
                  style={{ color: "oklch(0.55 0.006 260)" }}
                >
                  <Phone className="w-3 h-3" aria-hidden />
                  Tap to Call
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Getting Started */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
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
          transition={{ duration: 0.45, delay: 0.28 }}
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

        {/* Voice Commands Reference */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mb-12"
          aria-labelledby="voice-commands-heading"
          data-ocid="help.section"
        >
          <h2
            id="voice-commands-heading"
            className="font-display font-bold text-2xl text-foreground mb-5"
          >
            Voice Commands
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "oklch(0.09 0.003 260)",
              border: "1px solid oklch(0.90 0 0 / 7%)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: "1px solid oklch(0.90 0 0 / 7%)" }}
            >
              <Mic
                className="w-4 h-4"
                style={{ color: "oklch(0.82 0.10 195)" }}
                aria-hidden
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.82 0.10 195)" }}
              >
                Available Commands
              </span>
            </div>
            <div
              className="divide-y"
              style={{ borderColor: "oklch(0.90 0 0 / 5%)" }}
            >
              {VOICE_COMMANDS.map(({ command, description }, i) => (
                <div
                  key={command}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3"
                  data-ocid={`help.item.${i + 1}`}
                >
                  <code
                    className="text-xs font-mono font-semibold px-2 py-1 rounded w-fit flex-shrink-0"
                    style={{
                      backgroundColor: "oklch(0.82 0.10 195 / 10%)",
                      color: "oklch(0.82 0.10 195)",
                    }}
                  >
                    {command}
                  </code>
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.68 0.006 260)" }}
                  >
                    → {description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          aria-labelledby="faq-heading"
          className="mb-12"
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

        {/* Contact Support Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
          data-ocid="help.section"
        >
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              backgroundColor: "oklch(0.09 0.003 260)",
              border: "1px solid oklch(0.82 0.10 195 / 30%)",
              boxShadow: "0 0 20px oklch(0.82 0.10 195 / 8%)",
            }}
          >
            <div className="flex-1">
              <h2 className="font-bold text-xl text-foreground mb-2">
                Need more help?
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.68 0.006 260)" }}
              >
                Ask Aster anything — she can walk you through any feature step
                by step.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("chat")}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                backgroundColor: "oklch(0.82 0.10 195)",
                color: "oklch(0.08 0.003 260)",
              }}
              aria-label="Chat with Aster"
              data-ocid="help.primary_button"
            >
              <PhoneCall className="w-4 h-4" aria-hidden />
              Chat with Aster
            </button>
          </div>
        </motion.section>

        <footer
          className="mt-4 pt-6 text-center"
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

      {/* SOS Pulse Keyframe */}
      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.55 0.25 20 / 60%); }
          50% { box-shadow: 0 0 0 16px oklch(0.55 0.25 20 / 0%); }
        }
      `}</style>
    </div>
  );
}
