import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  CheckSquare,
  ChevronRight,
  MapPin,
  Mic,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";
import VoicePanel from "../components/VoicePanel";
import { useAI } from "../hooks/useAI";
import { useAllTasks } from "../hooks/useQueries";

interface DashboardProps {
  onNavigate: (page: AppPage) => void;
}

const QUICK_ACTIONS: {
  icon: typeof Mic;
  label: string;
  page: AppPage;
  color: string;
}[] = [
  {
    icon: CheckSquare,
    label: "Tasks",
    page: "tasks",
    color: "oklch(0.82 0.10 195)",
  },
  {
    icon: Zap,
    label: "GravityMode",
    page: "gravity",
    color: "oklch(0.70 0.19 45)",
  },
  {
    icon: MapPin,
    label: "EarthMode",
    page: "earth",
    color: "oklch(0.52 0.22 261)",
  },
  {
    icon: Settings,
    label: "Settings",
    page: "settings",
    color: "oklch(0.78 0.16 155)",
  },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: tasks = [] } = useAllTasks();
  const { checkAIConfigured } = useAI();
  const [aiConfigured, setAiConfigured] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    checkAIConfigured().then((configured) => {
      if (!cancelled) setAiConfigured(configured);
    });
    return () => {
      cancelled = true;
    };
  }, [checkAIConfigured]);

  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  const sampleTasks =
    upcomingTasks.length > 0
      ? upcomingTasks
      : [
          {
            title: "Team standup meeting",
            category: "work",
            completed: false,
            id: BigInt(0),
            dueDate: BigInt(0),
            description: "",
          },
          {
            title: "Pick up groceries",
            category: "home",
            completed: false,
            id: BigInt(1),
            dueDate: BigInt(0),
            description: "",
          },
          {
            title: "Review project proposal",
            category: "work",
            completed: false,
            id: BigInt(2),
            dueDate: BigInt(0),
            description: "",
          },
          {
            title: "Fix kitchen faucet",
            category: "home",
            completed: false,
            id: BigInt(3),
            dueDate: BigInt(0),
            description: "",
          },
        ];

  const hour = currentTime.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    setVoiceOpen(true);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Scrollable content ── */}
      <div className="flex-1 px-5 sm:px-8 pt-8 pb-28">
        {/* AI Status + time row */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{formattedTime}</span>
            <span className="mx-2">·</span>
            <span>{formattedDate}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
            style={
              aiConfigured
                ? {
                    backgroundColor: "oklch(0.78 0.16 155 / 12%)",
                    color: "oklch(0.78 0.16 155)",
                    border: "1px solid oklch(0.78 0.16 155 / 25%)",
                  }
                : {
                    backgroundColor: "oklch(0.87 0.16 65 / 10%)",
                    color: "oklch(0.87 0.16 65)",
                    border: "1px solid oklch(0.87 0.16 65 / 25%)",
                  }
            }
            aria-label={aiConfigured ? "AI Connected" : "AI not configured"}
            data-ocid="dashboard.button"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: aiConfigured
                  ? "oklch(0.78 0.16 155)"
                  : "oklch(0.87 0.16 65)",
              }}
            />
            {aiConfigured ? "AI Active" : "AI Offline"}
          </button>
        </div>

        {/* Hero greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2 tracking-tight">
            {greeting}
          </h1>
          <p className="text-muted-foreground text-lg">
            How can I help you today?
          </p>
        </motion.div>

        {/* Quick action chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {QUICK_ACTIONS.map(({ icon: Icon, label, page, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(page)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                backgroundColor: "oklch(0.09 0.003 260)",
                border: "1px solid oklch(0.90 0 0 / 10%)",
                color: "oklch(0.80 0.006 260)",
              }}
              aria-label={`Open ${label}`}
              data-ocid="dashboard.button"
            >
              <Icon className="w-3.5 h-3.5" style={{ color }} aria-hidden />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Upcoming tasks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Upcoming
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="View all tasks"
              data-ocid="dashboard.link"
            >
              View all <ChevronRight className="w-3 h-3" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {sampleTasks.map((task, i) => (
              <motion.div
                key={task.id.toString()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "oklch(0.09 0.003 260)",
                  border: "1px solid oklch(0.90 0 0 / 7%)",
                }}
                data-ocid={`dashboard.item.${i + 1}`}
              >
                <span
                  className="w-1 h-5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      task.category === "work"
                        ? "oklch(0.52 0.22 261)"
                        : "oklch(0.78 0.16 155)",
                  }}
                  aria-hidden
                />
                <span className="flex-1 text-sm text-foreground truncate">
                  {task.title}
                </span>
                <Badge
                  className="text-[10px] px-2 py-0 rounded-full font-normal"
                  style={{
                    backgroundColor: "oklch(0.12 0.004 260)",
                    color: "oklch(0.55 0.006 260)",
                    border: "none",
                  }}
                >
                  {task.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom input bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 md:left-[260px] z-30 px-5 sm:px-8 py-4 input-bar"
        style={{ borderTop: "1px solid oklch(0.90 0 0 / 7%)" }}
      >
        {/* Mobile: above tab bar */}
        <div className="max-w-2xl mx-auto">
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
              data-ocid="dashboard.primary_button"
            >
              <Mic className="w-4 h-4 text-cyan" aria-hidden />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Asteroid…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              aria-label="Message input"
              data-ocid="dashboard.input"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: inputText.trim()
                  ? "oklch(0.82 0.10 195)"
                  : "oklch(0.13 0.004 260)",
              }}
              aria-label="Send message"
              data-ocid="dashboard.submit_button"
            >
              <ArrowUp
                className="w-4 h-4"
                style={{
                  color: inputText.trim()
                    ? "oklch(0.065 0.002 260)"
                    : "oklch(0.45 0.005 260)",
                }}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>

      <VoicePanel
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
