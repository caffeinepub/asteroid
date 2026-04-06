import { Loader2, Mic, MicOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";
import { useAI } from "../hooks/useAI";
import { useAddTask, useAddVoiceLog } from "../hooks/useQueries";

interface Message {
  role: "user" | "asteroid";
  text: string;
  time: string;
  id: string;
  loading?: boolean;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function handleLocalCommand(
  input: string,
  onNavigate: (page: AppPage) => void,
  addTask: (task: {
    title: string;
    category: string;
    completed: boolean;
    dueDate: bigint;
    description: string;
  }) => void,
): string | null {
  const lower = input.toLowerCase();
  if (
    lower.includes("add task") ||
    lower.includes("create task") ||
    lower.includes("new task")
  ) {
    const match = lower.match(/(?:add|create|new) task[:\s]+(.+)/);
    const taskName = match ? match[1].trim() : "New task";
    addTask({
      title: taskName,
      category: "home",
      completed: false,
      dueDate: BigInt(Date.now()),
      description: "",
    });
    return `I've added "${taskName}" to your task list.`;
  }
  if (
    lower.includes("show tasks") ||
    lower.includes("my tasks") ||
    lower.includes("list tasks")
  ) {
    setTimeout(() => onNavigate("tasks"), 500);
    return "Opening your tasks. You have a few items waiting for your attention!";
  }
  if (
    lower.includes("gluon") ||
    lower.includes("gravity") ||
    lower.includes("camera navigation") ||
    lower.includes("obstacle")
  ) {
    setTimeout(() => onNavigate("gravity"), 500);
    return "Activating GluonMode. I'll start scanning your environment for obstacles and hazards.";
  }
  if (
    lower.includes("navigate") ||
    lower.includes("nucleus") ||
    lower.includes("earth") ||
    lower.includes("directions") ||
    lower.includes("route")
  ) {
    setTimeout(() => onNavigate("earth"), 500);
    return "Opening NucleusMode. Where would you like to go? I can provide turn-by-turn guidance.";
  }
  if (lower.includes("settings") || lower.includes("preferences")) {
    setTimeout(() => onNavigate("settings"), 500);
    return "Opening your settings. You can configure wake word, speech rate, and accessibility options there.";
  }
  return null;
}

interface VoicePanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: AppPage) => void;
}

export default function VoicePanel({
  open,
  onClose,
  onNavigate,
}: VoicePanelProps) {
  const { sendMessage, checkAIConfigured } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "asteroid",
      text: "Hi! I'm Asteroid. Hold the mic to speak, or type a command below.",
      time: getTime(),
      id: "init",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [speechSupported] = useState(
    () =>
      !!(
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      ),
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const addVoiceLog = useAddVoiceLog();
  const addTask = useAddTask();

  // Check AI configuration status on mount
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

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1;
    window.speechSynthesis.speak(utt);
  }, []);

  const processInput = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        role: "user",
        text: trimmed,
        time: getTime(),
        id: `u-${Date.now()}`,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Check for local navigation/task commands first
      const localResp = handleLocalCommand(trimmed, onNavigate, (task) =>
        addTask.mutate(task),
      );

      if (localResp) {
        const asteroidMsg: Message = {
          role: "asteroid",
          text: localResp,
          time: getTime(),
          id: `a-${Date.now()}`,
        };
        setMessages((prev) => [...prev, asteroidMsg]);
        speak(localResp);
        addVoiceLog.mutate({
          userInput: trimmed,
          assistantResponse: localResp,
          timestamp: BigInt(Date.now()),
        });
        return;
      }

      // Try AI via backend proxy
      if (!aiConfigured) {
        const noKeyMsg =
          "AI assistant is not set up yet. Please contact the administrator.";
        const asteroidMsg: Message = {
          role: "asteroid",
          text: noKeyMsg,
          time: getTime(),
          id: `a-${Date.now()}`,
        };
        setMessages((prev) => [...prev, asteroidMsg]);
        speak(noKeyMsg);
        return;
      }

      setIsThinking(true);
      try {
        const response = await sendMessage(trimmed);
        const asteroidMsg: Message = {
          role: "asteroid",
          text: response,
          time: getTime(),
          id: `a-${Date.now()}`,
        };
        setMessages((prev) => [...prev, asteroidMsg]);
        speak(response);
        addVoiceLog.mutate({
          userInput: trimmed,
          assistantResponse: response,
          timestamp: BigInt(Date.now()),
        });
      } catch (err: any) {
        const errText = `Sorry, I ran into an error: ${
          err?.message ?? "Unknown error"
        }. Please try again.`;
        const asteroidMsg: Message = {
          role: "asteroid",
          text: errText,
          time: getTime(),
          id: `a-${Date.now()}`,
        };
        setMessages((prev) => [...prev, asteroidMsg]);
        speak(errText);
      } finally {
        setIsThinking(false);
      }
    },
    [onNavigate, addTask, addVoiceLog, speak, aiConfigured, sendMessage],
  );

  const startListening = useCallback(() => {
    if (!speechSupported) {
      setMicError(
        "Speech recognition is not supported in this browser. Try Chrome or Edge.",
      );
      return;
    }
    setMicError(null);
    setInterimTranscript("");

    if (navigator.vibrate) navigator.vibrate(100);

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
      if (final) {
        setInterimTranscript("");
        processInput(final);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setInterimTranscript("");
      if (
        event.error === "not-allowed" ||
        event.error === "permission-denied"
      ) {
        setMicError(
          "Microphone access was denied. Please allow microphone permission and try again.",
        );
      } else if (event.error === "no-speech") {
        setMicError("No speech detected. Please try again.");
      } else {
        setMicError(`Microphone error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, processInput]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const handleVoiceHold = () => {
    if (!isListening) startListening();
  };

  const handleVoiceRelease = () => {
    if (isListening) stopListening();
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processInput(inputText.trim());
    setInputText("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: "oklch(0.04 0.002 286 / 80%)" }}
          data-ocid="voice.dialog"
        >
          <motion.dialog
            open
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden m-0 p-0"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.83 0.11 195 / 30%)",
              maxHeight: "80vh",
            }}
            aria-label="Asteroid voice assistant"
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid oklch(0.92 0.005 260 / 12%)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "oklch(0.14 0.03 195)" }}
                >
                  <Mic className="w-4 h-4 text-cyan" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-foreground">
                    Asteroid
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isListening
                      ? "Listening..."
                      : isThinking
                        ? "Thinking..."
                        : aiConfigured
                          ? "AI Connected"
                          : "Voice Assistant"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Close voice assistant"
                data-ocid="voice.close_button"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="max-w-[80%] rounded-xl px-4 py-2.5"
                    style={
                      msg.role === "user"
                        ? {
                            backgroundColor: "oklch(0.83 0.11 195)",
                            color: "oklch(0.08 0.002 286)",
                          }
                        : {
                            backgroundColor: "oklch(0.15 0.007 270)",
                            border: "1px solid oklch(0.92 0.005 260 / 15%)",
                          }
                    }
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl px-4 py-2.5 flex items-center gap-2"
                    style={{
                      backgroundColor: "oklch(0.15 0.007 270)",
                      border: "1px solid oklch(0.92 0.005 260 / 15%)",
                    }}
                    aria-live="polite"
                    data-ocid="voice.loading_state"
                  >
                    <Loader2 className="w-3 h-3 animate-spin text-cyan" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
              {/* Interim transcript bubble */}
              {interimTranscript && (
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] rounded-xl px-4 py-2.5 opacity-60"
                    style={{
                      backgroundColor: "oklch(0.83 0.11 195)",
                      color: "oklch(0.08 0.002 286)",
                      border: "1px dashed oklch(0.83 0.11 195)",
                    }}
                  >
                    <p className="text-sm italic">{interimTranscript}\u2026</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Error region */}
            {micError && (
              <div
                role="alert"
                aria-live="assertive"
                className="mx-5 mb-2 px-4 py-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "oklch(0.18 0.05 25)",
                  color: "oklch(0.85 0.12 25)",
                  border: "1px solid oklch(0.62 0.22 25 / 50%)",
                }}
                data-ocid="voice.error_state"
              >
                \u26a0 {micError}
              </div>
            )}

            <div
              className="px-5 py-4 flex flex-col gap-3"
              style={{ borderTop: "1px solid oklch(0.92 0.005 260 / 12%)" }}
            >
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onMouseDown={handleVoiceHold}
                  onMouseUp={handleVoiceRelease}
                  onMouseLeave={() => {
                    if (isListening) handleVoiceRelease();
                  }}
                  onTouchStart={handleVoiceHold}
                  onTouchEnd={handleVoiceRelease}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isListening
                      ? "oklch(0.83 0.11 195)"
                      : "oklch(0.14 0.03 195)",
                    border: "2px solid oklch(0.83 0.11 195)",
                  }}
                  aria-label={
                    isListening
                      ? "Release to stop listening"
                      : speechSupported
                        ? "Hold to speak"
                        : "Speech not supported"
                  }
                  aria-pressed={isListening}
                  disabled={!speechSupported || isThinking}
                  data-ocid="voice.primary_button"
                >
                  {isListening ? (
                    <div className="flex items-end gap-0.5 h-7">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-background animate-sound-wave"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            height: "100%",
                          }}
                          aria-hidden
                        />
                      ))}
                    </div>
                  ) : isThinking ? (
                    <Loader2 className="w-6 h-6 text-cyan animate-spin" />
                  ) : (
                    <MicOff className="w-6 h-6 text-cyan" />
                  )}
                </button>
                {!speechSupported && (
                  <p className="text-xs text-muted-foreground text-center">
                    Speech recognition not supported — use text input below
                  </p>
                )}
                {isListening && (
                  <p
                    className="text-xs animate-pulse"
                    style={{ color: "oklch(0.83 0.11 195)" }}
                    aria-live="polite"
                  >
                    Listening\u2026 release to stop
                  </p>
                )}
              </div>

              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  style={{ border: "1px solid oklch(0.92 0.005 260 / 20%)" }}
                  aria-label="Type a voice command"
                  data-ocid="voice.input"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  style={{
                    backgroundColor: "oklch(0.83 0.11 195)",
                    color: "oklch(0.08 0.002 286)",
                  }}
                  aria-label="Send message"
                  disabled={isThinking}
                  data-ocid="voice.submit_button"
                >
                  {isThinking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
            </div>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
