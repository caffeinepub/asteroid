import { Mic, MicOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";
import { useAddTask, useAddVoiceLog } from "../hooks/useQueries";

interface Message {
  role: "user" | "asteroid";
  text: string;
  time: string;
  id: string;
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function generateResponse(
  input: string,
  onNavigate: (page: AppPage) => void,
  addTask: (task: {
    title: string;
    category: string;
    completed: boolean;
    dueDate: bigint;
    description: string;
  }) => void,
): string {
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
    lower.includes("gravity") ||
    lower.includes("camera navigation") ||
    lower.includes("obstacle")
  ) {
    setTimeout(() => onNavigate("gravity"), 500);
    return "Activating GravityMode. I'll start scanning your environment for obstacles and hazards.";
  }
  if (
    lower.includes("navigate") ||
    lower.includes("earth") ||
    lower.includes("directions") ||
    lower.includes("route")
  ) {
    setTimeout(() => onNavigate("earth"), 500);
    return "Opening EarthMode. Where would you like to go? I can provide turn-by-turn guidance.";
  }
  if (lower.includes("settings") || lower.includes("preferences")) {
    setTimeout(() => onNavigate("settings"), 500);
    return "Opening your settings. You can configure wake word, speech rate, and accessibility options there.";
  }
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return "Hello! I'm Asteroid, your smart assistant. How can I help you today?";
  }
  if (lower.includes("time") || lower.includes("what time")) {
    return `It's currently ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;
  }
  if (lower.includes("weather")) {
    return "I'd need location access to fetch current weather. You can enable this in Settings under Location Services.";
  }
  return `I heard "${input}". Try "add task", "show tasks", "start GravityMode", or "navigate to [place]".`;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "asteroid",
      text: "Hi! I'm Asteroid. Hold the mic to speak, or type a command below.",
      time: getTime(),
      id: "init",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const addVoiceLog = useAddVoiceLog();
  const addTask = useAddTask();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const processInput = useCallback(
    (input: string) => {
      const userMsg: Message = {
        role: "user",
        text: input,
        time: getTime(),
        id: `u-${Date.now()}`,
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        const response = generateResponse(input, onNavigate, (task) =>
          addTask.mutate(task),
        );
        const asteroidMsg: Message = {
          role: "asteroid",
          text: response,
          time: getTime(),
          id: `a-${Date.now()}`,
        };
        setMessages((prev) => [...prev, asteroidMsg]);

        addVoiceLog.mutate({
          userInput: input,
          assistantResponse: response,
          timestamp: BigInt(Date.now()),
        });
      }, 800);
    },
    [onNavigate, addTask, addVoiceLog],
  );

  const handleVoiceHold = () => setIsListening(true);

  const handleVoiceRelease = () => {
    if (!isListening) return;
    setIsListening(false);
    const simulatedInputs = [
      "Show my tasks",
      "What time is it?",
      "Add task buy groceries",
      "Start GravityMode",
    ];
    const input =
      simulatedInputs[Math.floor(Math.random() * simulatedInputs.length)];
    processInput(input);
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
                    Voice Assistant
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
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
              <div ref={bottomRef} />
            </div>

            <div
              className="px-5 py-4 flex flex-col gap-3"
              style={{ borderTop: "1px solid oklch(0.92 0.005 260 / 12%)" }}
            >
              <div className="flex justify-center">
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
                      ? "Release to send voice message"
                      : "Hold to speak"
                  }
                  aria-pressed={isListening}
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
                  ) : (
                    <MicOff className="w-6 h-6 text-cyan" />
                  )}
                </button>
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
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: "oklch(0.83 0.11 195)",
                    color: "oklch(0.08 0.002 286)",
                  }}
                  aria-label="Send message"
                  data-ocid="voice.submit_button"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
