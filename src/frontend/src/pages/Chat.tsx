import { ArrowUp, MessageSquare, Mic, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";
import VoicePanel from "../components/VoicePanel";
import { useAI } from "../hooks/useAI";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const INTRO_MESSAGE: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Hi! I'm Aster, the Everything Assistant. I'm here to help you with tasks, navigation, reminders, and anything else you need. How can I help you today?",
  time: getTime(),
};

interface ChatPageProps {
  onNavigate: (page: AppPage) => void;
}

export default function ChatPage({ onNavigate }: ChatPageProps) {
  const { sendMessage, checkAIConfigured } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
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
  }); // eslint-disable-line

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
        const response = await sendMessage(trimmed);
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: response,
          time: getTime(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        const errMsg: ChatMessage = {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: `Sorry, I ran into an error: ${err?.message ?? "Unknown error"}. Please try again.`,
          time: getTime(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking, sendMessage],
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
        className="flex items-center justify-between px-5 sm:px-8 py-4 flex-shrink-0"
        style={{
          backgroundColor: "oklch(0.075 0.003 260)",
          borderBottom: "1px solid oklch(0.90 0 0 / 7%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.12 0.03 195)" }}
          >
            <MessageSquare
              className="w-4 h-4"
              style={{ color: "oklch(0.82 0.10 195)" }}
              aria-hidden
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-foreground">
              Chat with Aster
            </h1>
            <p className="text-xs" style={{ color: "oklch(0.55 0.006 260)" }}>
              {aiConfigured === null
                ? "Loading…"
                : aiConfigured
                  ? "AI Connected"
                  : "AI Offline"}
            </p>
          </div>
        </div>

        {/* AI status indicator */}
        {aiConfigured === false && (
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "oklch(0.87 0.16 65 / 10%)",
              color: "oklch(0.87 0.16 65)",
              border: "1px solid oklch(0.87 0.16 65 / 25%)",
            }}
            aria-label="Configure AI"
            data-ocid="chat.button"
          >
            <Settings className="w-3 h-3" aria-hidden />
            Setup AI
          </button>
        )}
        {aiConfigured === true && (
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "oklch(0.78 0.16 155 / 12%)",
              color: "oklch(0.78 0.16 155)",
              border: "1px solid oklch(0.78 0.16 155 / 25%)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
            />
            AI Active
          </span>
        )}
      </header>

      {/* AI not configured banner */}
      <AnimatePresence>
        {aiConfigured === false && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center justify-between gap-3 flex-shrink-0"
            style={{
              backgroundColor: "oklch(0.87 0.16 65 / 8%)",
              border: "1px solid oklch(0.87 0.16 65 / 20%)",
            }}
            role="alert"
            data-ocid="chat.error_state"
          >
            <p className="text-sm" style={{ color: "oklch(0.87 0.16 65)" }}>
              AI not configured — go to{" "}
              <strong>Settings → Setup API Key</strong>
            </p>
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.87 0.16 65 / 20%)",
                color: "oklch(0.87 0.16 65)",
              }}
              data-ocid="chat.secondary_button"
            >
              Go to Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 min-h-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {/* Message list */}
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
                    <span
                      className="text-xs font-semibold px-1"
                      style={{ color: "oklch(0.82 0.10 195)" }}
                    >
                      Aster
                    </span>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tl-sm"
                      style={{
                        backgroundColor: "oklch(0.09 0.003 260)",
                        border: "1px solid oklch(0.90 0 0 / 7%)",
                      }}
                    >
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                      <p
                        className="text-xs mt-1.5"
                        style={{ color: "oklch(0.45 0.005 260)" }}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm"
                    style={{
                      backgroundColor: "oklch(0.52 0.22 261 / 20%)",
                      border: "1px solid oklch(0.52 0.22 261 / 30%)",
                    }}
                  >
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <p
                      className="text-xs mt-1.5 text-right"
                      style={{ color: "oklch(0.45 0.005 260)" }}
                    >
                      {msg.time}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
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
                  <span
                    className="text-xs font-semibold px-1"
                    style={{ color: "oklch(0.82 0.10 195)" }}
                  >
                    Aster
                  </span>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1"
                    style={{
                      backgroundColor: "oklch(0.09 0.003 260)",
                      border: "1px solid oklch(0.90 0 0 / 7%)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "oklch(0.55 0.006 260)",
                          animationDelay: `${i * 0.15}s`,
                        }}
                        aria-hidden
                      />
                    ))}
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
          backgroundColor: "oklch(0.075 0.003 260)",
          borderTop: "1px solid oklch(0.90 0 0 / 7%)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
          data-ocid="chat.panel"
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{
              backgroundColor: "oklch(0.10 0.004 260)",
              border: "1px solid oklch(0.90 0 0 / 12%)",
            }}
          >
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "oklch(0.13 0.004 260)" }}
              aria-label="Open voice assistant"
              data-ocid="chat.primary_button"
            >
              <Mic
                className="w-4 h-4"
                style={{ color: "oklch(0.82 0.10 195)" }}
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
                aiConfigured === false
                  ? "Configure AI to start chatting…"
                  : "Message Aster…"
              }
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              aria-label="Chat message input"
              data-ocid="chat.input"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor:
                  inputText.trim() && !isThinking
                    ? "oklch(0.82 0.10 195)"
                    : "oklch(0.13 0.004 260)",
              }}
              aria-label="Send message"
              data-ocid="chat.submit_button"
            >
              <ArrowUp
                className="w-4 h-4"
                style={{
                  color:
                    inputText.trim() && !isThinking
                      ? "oklch(0.065 0.002 260)"
                      : "oklch(0.45 0.005 260)",
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
