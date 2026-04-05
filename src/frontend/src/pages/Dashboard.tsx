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
    color: "oklch(0.78 0.18 210)",
  },
  {
    icon: Zap,
    label: "GravityMode",
    page: "gravity",
    color: "oklch(0.72 0.22 35)",
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
    second: "2-digit",
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
      {/* Scrollable content */}
      <div className="flex-1 px-5 sm:px-8 pt-8 pb-28">
        {/* AI Status + time row */}
        <div className="flex items-center justify-between mb-10">
          {/* Telemetry time display */}
          <div className="flex flex-col gap-0.5">
            <span className="text-hud" style={{ opacity: 0.5 }}>
              {"LOCAL TIME //"}
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className="font-mono font-bold tracking-widest uppercase"
                style={{
                  fontSize: "1.1rem",
                  color: "oklch(0.92 0.004 220)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formattedTime}
              </span>
              <span
                className="font-mono text-xs tracking-wider uppercase"
                style={{ color: "oklch(0.55 0.008 220)" }}
              >
                {formattedDate}
              </span>
            </div>
          </div>

          {/* AI status badge */}
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              borderRadius: "0.2rem",
              ...(aiConfigured
                ? {
                    backgroundColor: "oklch(0.78 0.16 155 / 10%)",
                    color: "oklch(0.78 0.16 155)",
                    border: "1px solid oklch(0.78 0.16 155 / 30%)",
                  }
                : {
                    backgroundColor: "oklch(0.87 0.16 65 / 10%)",
                    color: "oklch(0.87 0.16 65)",
                    border: "1px solid oklch(0.87 0.16 65 / 30%)",
                  }),
            }}
            aria-label={aiConfigured ? "AI Connected" : "AI not configured"}
            data-ocid="dashboard.button"
          >
            <span
              className="w-1.5 h-1.5 rounded-full blink-dot"
              style={{
                backgroundColor: aiConfigured
                  ? "oklch(0.78 0.16 155)"
                  : "oklch(0.87 0.16 65)",
              }}
            />
            {aiConfigured ? "AI ACTIVE" : "AI OFFLINE"}
          </button>
        </div>

        {/* Hero greeting with animated HUD grid background + scan line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center hud-grid-bg py-12 px-4"
          style={{
            borderRadius: "0.2rem",
            border: "1px solid oklch(0.78 0.18 210 / 12%)",
          }}
        >
          {/* Scan line */}
          <div className="scan-line" aria-hidden />

          {/* Corner accent top-left */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "24px",
              height: "24px",
              borderTop: "1px solid oklch(0.78 0.18 210 / 55%)",
              borderLeft: "1px solid oklch(0.78 0.18 210 / 55%)",
            }}
          />
          {/* Corner accent bottom-right */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "24px",
              height: "24px",
              borderBottom: "1px solid oklch(0.78 0.18 210 / 55%)",
              borderRight: "1px solid oklch(0.78 0.18 210 / 55%)",
            }}
          />

          <h1
            className="font-display font-black text-5xl sm:text-7xl text-foreground mb-3 tracking-tight"
            style={{
              textShadow: "0 0 40px oklch(0.78 0.18 210 / 30%)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {greeting}
          </h1>
          <p
            className="font-mono text-sm uppercase tracking-widest"
            style={{
              color: "oklch(0.55 0.008 220)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {"// TRANSMIT YOUR REQUEST TO ASTER"}
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
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] clip-corner"
              style={{
                backgroundColor: "oklch(0.075 0.006 235)",
                border: `1px solid ${color}25`,
                borderLeft: `3px solid ${color}`,
                color: "oklch(0.80 0.006 240)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 0 16px ${color}20, inset 0 0 8px ${color}08`;
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  `${color}50`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  `${color}25`;
                (e.currentTarget as HTMLButtonElement).style.borderLeftColor =
                  color;
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
            <span className="text-hud" style={{ opacity: 0.7 }}>
              {"SYS // UPCOMING TASKS"}
            </span>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-cyan transition-colors flex items-center gap-1"
              aria-label="View all tasks"
              data-ocid="dashboard.link"
            >
              VIEW ALL <ChevronRight className="w-3 h-3" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {sampleTasks.map((task, i) => (
              <motion.div
                key={task.id.toString()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 clip-corner"
                style={{
                  backgroundColor: "oklch(0.075 0.006 235)",
                  border: "1px solid oklch(0.78 0.18 210 / 10%)",
                }}
                data-ocid={`dashboard.item.${i + 1}`}
              >
                <span
                  className="w-0.5 h-5 flex-shrink-0"
                  style={{
                    backgroundColor:
                      task.category === "work"
                        ? "oklch(0.52 0.22 261)"
                        : "oklch(0.78 0.16 155)",
                    boxShadow:
                      task.category === "work"
                        ? "0 0 6px oklch(0.52 0.22 261 / 60%)"
                        : "0 0 6px oklch(0.78 0.16 155 / 60%)",
                  }}
                  aria-hidden
                />
                <span className="flex-1 text-sm text-foreground truncate">
                  {task.title}
                </span>
                <Badge
                  className="text-[9px] px-2 py-0 font-mono uppercase tracking-wider"
                  style={{
                    backgroundColor: "oklch(0.10 0.006 235)",
                    color: "oklch(0.55 0.008 220)",
                    border: "1px solid oklch(0.78 0.18 210 / 12%)",
                    borderRadius: "0.1rem",
                  }}
                >
                  {task.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom input bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[260px] z-30 px-5 sm:px-8 py-4 input-bar">
        <div className="max-w-2xl mx-auto">
          {/* hud-glow instead of hud-border — safe for use with sharp corners */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 hud-glow"
            style={{
              backgroundColor: "oklch(0.075 0.006 235)",
              border: "1px solid oklch(0.78 0.18 210 / 25%)",
              borderRadius: "0.2rem",
            }}
          >
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: "oklch(0.78 0.18 210 / 12%)",
                border: "1px solid oklch(0.78 0.18 210 / 25%)",
                borderRadius: "0.2rem",
              }}
              aria-label="Open voice assistant"
              data-ocid="dashboard.primary_button"
            >
              <Mic
                className="w-4 h-4 text-cyan"
                style={{
                  filter: "drop-shadow(0 0 4px oklch(0.78 0.18 210 / 60%))",
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
              placeholder="// TRANSMIT TO ASTER"
              className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              style={{ letterSpacing: "0.05em" }}
              aria-label="Message input"
              data-ocid="dashboard.input"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-80 active:scale-95 ${
                inputText.trim() ? "animate-send-pulse" : ""
              }`}
              style={{
                backgroundColor: inputText.trim()
                  ? "oklch(0.78 0.18 210)"
                  : "oklch(0.10 0.006 235)",
                border: inputText.trim()
                  ? "1px solid oklch(0.78 0.18 210 / 60%)"
                  : "1px solid oklch(0.78 0.18 210 / 10%)",
                borderRadius: "0.2rem",
              }}
              aria-label="Send message"
              data-ocid="dashboard.submit_button"
            >
              <ArrowUp
                className="w-4 h-4"
                style={{
                  color: inputText.trim()
                    ? "oklch(0.04 0.005 240)"
                    : "oklch(0.45 0.005 240)",
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
