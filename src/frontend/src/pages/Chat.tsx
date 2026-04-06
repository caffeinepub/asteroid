import {
  ArrowUp,
  MessageSquare,
  Mic,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";
import VoicePanel from "../components/VoicePanel";
import { useAI } from "../hooks/useAI";
import { processOfflineMessage } from "../lib/offlineAI";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ONLINE_INTRO: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Hi! I'm Aster, the Everything Assistant. I'm here to help you with tasks, navigation, reminders, and anything else you need. How can I help you today?",
  time: getTime(),
};

const OFFLINE_INTRO: ChatMessage = {
  id: "intro-offline",
  role: "assistant",
  text: "Hi! I'm Aster, running in offline mode. I work entirely on your device — no internet or API key required. I'm trained on 10,000+ everyday scenarios: productivity, household tasks, cooking, health, finance, travel, tech, vehicles, pets, parenting, hobbies, legal basics, and much more. What can I help you with?",
  time: getTime(),
};

interface ChatPageProps {
  onNavigate: (page: AppPage) => void;
}

export default function ChatPage({ onNavigate }: ChatPageProps) {
  const { sendMessage, checkAIConfigured } = useAI();

  const [offlineMode, setOfflineMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("aster-offline-mode") === "true";
    } catch {
      return false;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(
    offlineMode ? [OFFLINE_INTRO] : [ONLINE_INTRO],
  );
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    checkAIConfigured().then((configured) => {
      if (!cancelled) setAiConfigured(configured);
    });
    return () => {
      cancelled = true;
    };
  }, [checkAIConfigured]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleToggleOffline = useCallback((enabled: boolean) => {
    setOfflineMode(enabled);
    try {
      localStorage.setItem("aster-offline-mode", String(enabled));
    } catch {}
    // Reset conversation with appropriate intro
    setMessages(enabled ? [OFFLINE_INTRO] : [ONLINE_INTRO]);
    setInputText("");
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        time: getTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsThinking(true);

      try {
        let responseText: string;

        if (offlineMode) {
          // Small artificial delay for UX (feels more natural than instant)
          await new Promise((resolve) =>
            setTimeout(resolve, 400 + Math.random() * 300),
          );
          responseText = processOfflineMessage(trimmed);
        } else {
          responseText = await sendMessage(trimmed);
        }

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: responseText,
          time: getTime(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const errMsg: ChatMessage = {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: `Sorry, I ran into an error: ${
            err instanceof Error ? err.message : "Unknown error"
          }. Please try again.`,
          time: getTime(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking, offlineMode, sendMessage],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  return (
    <div className="flex flex-col h-screen" data-ocid="chat.page">
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 sm:px-8 py-4 flex-shrink-0 hud-grid-static"
        style={{
          backgroundColor: "oklch(0.055 0.006 235)",
          borderBottom: "1px solid oklch(0.78 0.18 210 / 20%)",
          boxShadow: "0 4px 20px oklch(0.78 0.18 210 / 6%)",
        }}
      >
        {/* Left: title */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              backgroundColor: offlineMode
                ? "oklch(0.87 0.16 65 / 12%)"
                : "oklch(0.78 0.18 210 / 12%)",
              border: `1px solid ${
                offlineMode
                  ? "oklch(0.87 0.16 65 / 25%)"
                  : "oklch(0.78 0.18 210 / 25%)"
              }`,
              borderRadius: "0.2rem",
              boxShadow: offlineMode
                ? "0 0 12px oklch(0.87 0.16 65 / 15%)"
                : "0 0 12px oklch(0.78 0.18 210 / 15%)",
            }}
          >
            <MessageSquare
              className="w-4 h-4"
              style={{
                color: offlineMode
                  ? "oklch(0.87 0.16 65)"
                  : "oklch(0.78 0.18 210)",
              }}
              aria-hidden
            />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm uppercase tracking-widest text-foreground">
              Chat with Aster
            </h1>
            <p className="text-hud" style={{ opacity: 0.6, fontSize: "10px" }}>
              {offlineMode
                ? "SYS // OFFLINE ENGINE ACTIVE"
                : aiConfigured === null
                  ? "INITIALIZING..."
                  : aiConfigured
                    ? "SYS // AI ONLINE"
                    : "SYS // AI OFFLINE"}
            </p>
          </div>
        </div>

        {/* Right: offline toggle + status badge */}
        <div className="flex items-center gap-3">
          {/* Offline Mode Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={offlineMode}
            aria-label={
              offlineMode ? "Switch to online mode" : "Switch to offline mode"
            }
            onClick={() => handleToggleOffline(!offlineMode)}
            className="flex items-center gap-2 px-3 py-1.5 transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: offlineMode
                ? "oklch(0.87 0.16 65 / 12%)"
                : "oklch(0.78 0.18 210 / 8%)",
              border: `1px solid ${
                offlineMode
                  ? "oklch(0.87 0.16 65 / 35%)"
                  : "oklch(0.78 0.18 210 / 20%)"
              }`,
              borderRadius: "0.2rem",
            }}
            data-ocid="chat.button"
          >
            {offlineMode ? (
              <WifiOff
                className="w-3 h-3"
                style={{ color: "oklch(0.87 0.16 65)" }}
                aria-hidden
              />
            ) : (
              <Wifi
                className="w-3 h-3"
                style={{ color: "oklch(0.78 0.18 210)" }}
                aria-hidden
              />
            )}
            <span
              className="text-[10px] font-mono uppercase tracking-widest font-semibold"
              style={{
                color: offlineMode
                  ? "oklch(0.87 0.16 65)"
                  : "oklch(0.78 0.18 210)",
              }}
            >
              {offlineMode ? "OFFLINE" : "ONLINE"}
            </span>
            {/* Toggle pill */}
            <span
              className="relative inline-flex w-7 h-4 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: offlineMode
                  ? "oklch(0.87 0.16 65 / 40%)"
                  : "oklch(0.78 0.18 210 / 30%)",
                border: `1px solid ${
                  offlineMode
                    ? "oklch(0.87 0.16 65 / 60%)"
                    : "oklch(0.78 0.18 210 / 40%)"
                }`,
              }}
              aria-hidden
            >
              <span
                className="absolute top-0.5 w-3 h-3 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: offlineMode
                    ? "oklch(0.87 0.16 65)"
                    : "oklch(0.78 0.18 210)",
                  transform: offlineMode
                    ? "translateX(14px)"
                    : "translateX(0px)",
                  left: "1px",
                }}
              />
            </span>
          </button>

          {/* AI status indicator (online mode only) */}
          {!offlineMode && aiConfigured === false && (
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.87 0.16 65 / 10%)",
                color: "oklch(0.87 0.16 65)",
                border: "1px solid oklch(0.87 0.16 65 / 25%)",
                borderRadius: "0.2rem",
              }}
              aria-label="Configure AI"
              data-ocid="chat.secondary_button"
            >
              <Settings className="w-3 h-3" aria-hidden />
              SETUP AI
            </button>
          )}
          {!offlineMode && aiConfigured === true && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest"
              style={{
                backgroundColor: "oklch(0.78 0.16 155 / 10%)",
                color: "oklch(0.78 0.16 155)",
                border: "1px solid oklch(0.78 0.16 155 / 25%)",
                borderRadius: "0.2rem",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full blink-dot"
                style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
              />
              AI ACTIVE
            </span>
          )}
          {offlineMode && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest"
              style={{
                backgroundColor: "oklch(0.87 0.16 65 / 10%)",
                color: "oklch(0.87 0.16 65)",
                border: "1px solid oklch(0.87 0.16 65 / 25%)",
                borderRadius: "0.2rem",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full blink-dot"
                style={{ backgroundColor: "oklch(0.87 0.16 65)" }}
              />
              LOCAL
            </span>
          )}
        </div>
      </header>

      {/* AI not configured banner — only show in online mode */}
      <AnimatePresence>
        {!offlineMode && aiConfigured === false && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0"
            style={{
              backgroundColor: "oklch(0.87 0.16 65 / 8%)",
              border: "1px solid oklch(0.87 0.16 65 / 20%)",
              borderRadius: "0.2rem",
            }}
            role="alert"
            data-ocid="chat.error_state"
          >
            <p
              className="text-sm font-mono"
              style={{ color: "oklch(0.87 0.16 65)" }}
            >
              AI not configured — go to{" "}
              <strong>Settings → Setup API Key</strong> or toggle{" "}
              <strong>OFFLINE</strong> mode above to use Aster without an API
              key.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="text-[10px] font-mono uppercase tracking-widest font-semibold px-3 py-1.5 flex-shrink-0 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.87 0.16 65 / 20%)",
                color: "oklch(0.87 0.16 65)",
                borderRadius: "0.2rem",
              }}
              data-ocid="chat.secondary_button"
            >
              SETTINGS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline mode info bar */}
      <AnimatePresence>
        {offlineMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 px-4 py-2.5 flex items-center gap-3 flex-shrink-0"
            style={{
              backgroundColor: "oklch(0.87 0.16 65 / 6%)",
              border: "1px solid oklch(0.87 0.16 65 / 18%)",
              borderRadius: "0.2rem",
            }}
            data-ocid="chat.panel"
          >
            <WifiOff
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "oklch(0.87 0.16 65 / 70%)" }}
              aria-hidden
            />
            <p
              className="text-[10px] font-mono"
              style={{ color: "oklch(0.87 0.16 65 / 80%)" }}
            >
              OFFLINE ENGINE — local rule-based AI, 10,000+ scenarios. No
              internet needed. Toggle ONLINE for cloud AI.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 min-h-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                data-ocid={`chat.item.${i + 1}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <span className="text-hud px-1" style={{ opacity: 0.8 }}>
                      {offlineMode ? "ASTER · OFFLINE" : "ASTER"}
                    </span>
                    <div
                      className="px-4 py-3 clip-corner hud-glow"
                      style={{
                        backgroundColor: "oklch(0.075 0.006 235)",
                        border: `1px solid ${
                          offlineMode
                            ? "oklch(0.87 0.16 65 / 20%)"
                            : "oklch(0.78 0.18 210 / 20%)"
                        }`,
                        borderLeft: `3px solid ${
                          offlineMode
                            ? "oklch(0.87 0.16 65 / 60%)"
                            : "oklch(0.78 0.18 210 / 60%)"
                        }`,
                      }}
                    >
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                      <p
                        className="text-[10px] font-mono mt-1.5"
                        style={{ color: "oklch(0.38 0.005 240)" }}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      backgroundColor: offlineMode
                        ? "oklch(0.87 0.16 65 / 8%)"
                        : "oklch(0.78 0.18 210 / 10%)",
                      border: `1px solid ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 20%)"
                          : "oklch(0.78 0.18 210 / 25%)"
                      }`,
                      borderRight: `3px solid ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 60%)"
                          : "oklch(0.78 0.18 210 / 70%)"
                      }`,
                      borderRadius: "0.2rem 0 0.2rem 0.2rem",
                      boxShadow: `0 0 12px ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 5%)"
                          : "oklch(0.78 0.18 210 / 6%)"
                      }`,
                    }}
                  >
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <p
                      className="text-[10px] font-mono mt-1.5 text-right"
                      style={{ color: "oklch(0.38 0.005 240)" }}
                    >
                      {msg.time}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex justify-start"
                data-ocid="chat.loading_state"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-hud px-1" style={{ opacity: 0.8 }}>
                    {offlineMode ? "ASTER · OFFLINE" : "ASTER"}
                  </span>
                  <div
                    className="px-4 py-3 clip-corner hud-glow flex items-center gap-1.5"
                    style={{
                      backgroundColor: "oklch(0.075 0.006 235)",
                      border: `1px solid ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 20%)"
                          : "oklch(0.78 0.18 210 / 20%)"
                      }`,
                      borderLeft: `3px solid ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 60%)"
                          : "oklch(0.78 0.18 210 / 60%)"
                      }`,
                    }}
                  >
                    <span className="typing-bar" aria-hidden />
                    <span className="typing-bar" aria-hidden />
                    <span className="typing-bar" aria-hidden />
                    <span
                      className="text-[10px] font-mono ml-2"
                      style={{ color: "oklch(0.55 0.008 220)" }}
                    >
                      {offlineMode ? "MATCHING..." : "PROCESSING..."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom input bar */}
      <div
        className="flex-shrink-0 px-4 sm:px-8 py-4"
        style={{
          backgroundColor: "oklch(0.055 0.006 235)",
          borderTop: `1px solid ${
            offlineMode
              ? "oklch(0.87 0.16 65 / 12%)"
              : "oklch(0.78 0.18 210 / 15%)"
          }`,
          boxShadow: `0 -4px 20px ${
            offlineMode
              ? "oklch(0.87 0.16 65 / 4%)"
              : "oklch(0.78 0.18 210 / 5%)"
          }`,
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
          data-ocid="chat.form"
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 hud-glow"
            style={{
              backgroundColor: "oklch(0.075 0.006 235)",
              border: `1px solid ${
                offlineMode
                  ? "oklch(0.87 0.16 65 / 22%)"
                  : "oklch(0.78 0.18 210 / 25%)"
              }`,
              borderRadius: "0.2rem",
            }}
          >
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: offlineMode
                  ? "oklch(0.87 0.16 65 / 10%)"
                  : "oklch(0.78 0.18 210 / 12%)",
                border: `1px solid ${
                  offlineMode
                    ? "oklch(0.87 0.16 65 / 22%)"
                    : "oklch(0.78 0.18 210 / 25%)"
                }`,
                borderRadius: "0.2rem",
              }}
              aria-label="Open voice assistant"
              data-ocid="chat.primary_button"
            >
              <Mic
                className="w-4 h-4"
                style={{
                  color: offlineMode
                    ? "oklch(0.87 0.16 65)"
                    : "oklch(0.78 0.18 210)",
                  filter: offlineMode
                    ? "drop-shadow(0 0 4px oklch(0.87 0.16 65 / 60%))"
                    : "drop-shadow(0 0 4px oklch(0.78 0.18 210 / 60%))",
                }}
                aria-hidden
              />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                offlineMode
                  ? "// ASK ASTER OFFLINE..."
                  : aiConfigured === false
                    ? "// CONFIGURE AI TO TRANSMIT..."
                    : "// TRANSMIT TO ASTER..."
              }
              className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              style={{ letterSpacing: "0.05em" }}
              aria-label="Chat message input"
              data-ocid="chat.input"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-80 active:scale-95 ${
                inputText.trim() && !isThinking ? "animate-send-pulse" : ""
              }`}
              style={{
                backgroundColor:
                  inputText.trim() && !isThinking
                    ? offlineMode
                      ? "oklch(0.87 0.16 65)"
                      : "oklch(0.78 0.18 210)"
                    : "oklch(0.10 0.006 235)",
                border:
                  inputText.trim() && !isThinking
                    ? `1px solid ${
                        offlineMode
                          ? "oklch(0.87 0.16 65 / 60%)"
                          : "oklch(0.78 0.18 210 / 60%)"
                      }`
                    : "1px solid oklch(0.78 0.18 210 / 10%)",
                borderRadius: "0.2rem",
              }}
              aria-label="Send message"
              data-ocid="chat.submit_button"
            >
              <ArrowUp
                className="w-4 h-4"
                style={{
                  color:
                    inputText.trim() && !isThinking
                      ? "oklch(0.04 0.005 240)"
                      : "oklch(0.45 0.005 240)",
                }}
                aria-hidden
              />
            </button>
          </div>
        </form>
      </div>

      <VoicePanel
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
