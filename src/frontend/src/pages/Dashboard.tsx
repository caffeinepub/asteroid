import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Camera,
  CheckSquare,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Mic,
  Navigation,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AppPage } from "../App";
import VoicePanel from "../components/VoicePanel";
import { useAllTasks } from "../hooks/useQueries";

interface DashboardProps {
  onNavigate: (page: AppPage) => void;
}

const CAMERA_STATUSES = [
  "Initializing camera...",
  "Scanning environment...",
  "Clear path detected",
  "Environment nominal",
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: tasks = [] } = useAllTasks();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cameraStatusIdx, setCameraStatusIdx] = useState(0);
  const [voiceOpen, setVoiceOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCameraStatusIdx((i) => (i + 1) % CAMERA_STATUSES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 3);
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Column 1: Greeting + Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="card-dark rounded-xl p-6">
            <h1 className="font-display font-bold text-4xl text-foreground mb-1">
              Hi Alex!
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-semibold text-foreground">
                {formattedTime}
              </span>
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">
                Current Mode:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-foreground tracking-wide">
                  STANDARD
                </span>
                <Badge
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: "oklch(0.78 0.16 155)",
                    color: "oklch(0.08 0.002 286)",
                  }}
                >
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">
                Upcoming Tasks
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("tasks")}
                className="text-cyan text-xs hover:opacity-80 active:opacity-60 transition-opacity duration-150 flex items-center gap-1"
                aria-label="View all tasks"
                data-ocid="dashboard.link"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {sampleTasks.map((task) => (
                <div
                  key={task.id.toString()}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: "oklch(0.13 0.007 270)" }}
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        task.category === "work"
                          ? "oklch(0.52 0.22 261)"
                          : "oklch(0.78 0.16 155)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {task.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Column 2: Voice CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="card-dark rounded-xl p-6 h-full flex flex-col items-center justify-center gap-6 text-center relative overflow-hidden"
            style={{
              borderColor: "oklch(0.83 0.11 195 / 30%)",
              borderWidth: "1px",
            }}
          >
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.83 0.11 195 / 8%) 0%, transparent 70%)",
              }}
            />

            <h2 className="font-display font-bold text-2xl uppercase tracking-widest text-foreground relative z-10">
              TALK TO ASTEROID
            </h2>

            <div className="relative z-10">
              <button
                type="button"
                onClick={() => setVoiceOpen(true)}
                className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-95 animate-mic-glow"
                style={{
                  backgroundColor: "oklch(0.14 0.03 195)",
                  border: "2px solid oklch(0.83 0.11 195)",
                }}
                aria-label="Hold to speak with Asteroid voice assistant"
                data-ocid="dashboard.primary_button"
              >
                <Mic className="w-12 h-12 text-cyan" />
                <span
                  className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{ border: "2px solid oklch(0.83 0.11 195 / 40%)" }}
                  aria-hidden="true"
                />
              </button>
            </div>

            <p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase relative z-10">
              HOLD TO SPEAK
            </p>
            <p className="text-xs text-muted-foreground relative z-10">
              Or say{" "}
              <span className="text-cyan font-semibold">"Hey Asteroid"</span> to
              wake
            </p>
          </div>
        </motion.div>

        {/* Column 3: Live Camera Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-dark rounded-xl p-6 h-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">
                Live Camera Status
              </h2>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.78 0.16 155)" }}
                >
                  Active
                </span>
              </span>
            </div>

            <div
              className="flex-1 rounded-lg flex flex-col items-center justify-center gap-3 min-h-32"
              style={{
                backgroundColor: "oklch(0.09 0.002 270)",
                border: "1px solid oklch(0.92 0.005 260 / 10%)",
              }}
            >
              <Camera className="w-8 h-8 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground text-center">
                {CAMERA_STATUSES[cameraStatusIdx]}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: "Obstacle Detection", on: true },
                { label: "Depth Estimation", on: true },
                { label: "Object Labeling", on: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={
                      item.on
                        ? {
                            backgroundColor: "oklch(0.83 0.11 195)",
                            color: "oklch(0.08 0.002 286)",
                          }
                        : {
                            backgroundColor: "oklch(0.15 0.005 264)",
                            color: "oklch(0.76 0.009 264)",
                          }
                    }
                  >
                    {item.on ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature tiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            icon: CheckSquare,
            label: "Tasks",
            color: "oklch(0.83 0.11 195)",
            bg: "oklch(0.14 0.03 195 / 60%)",
            page: "tasks" as AppPage,
          },
          {
            icon: Calendar,
            label: "GravityMode",
            color: "oklch(0.70 0.19 45)",
            bg: "oklch(0.14 0.06 45 / 60%)",
            page: "gravity" as AppPage,
          },
          {
            icon: Navigation,
            label: "EarthMode",
            color: "oklch(0.52 0.22 261)",
            bg: "oklch(0.12 0.05 261 / 60%)",
            page: "earth" as AppPage,
          },
          {
            icon: Settings,
            label: "Settings",
            color: "oklch(0.78 0.16 155)",
            bg: "oklch(0.12 0.05 155 / 60%)",
            page: "settings" as AppPage,
          },
        ].map(({ icon: Icon, label, color, bg, page }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(page)}
            className="card-dark rounded-xl p-6 flex flex-col items-center gap-3 hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 min-h-[110px]"
            style={{ borderColor: `${color}30` }}
            aria-label={`Navigate to ${label}`}
            data-ocid="dashboard.button"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <Icon className="w-6 h-6" style={{ color }} aria-hidden />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-wide text-foreground">
              {label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Accessibility Modes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="font-display font-bold text-xl uppercase tracking-widest text-foreground mb-4">
          Accessibility Modes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="card-dark rounded-xl p-6 flex flex-col gap-4"
            style={{
              borderColor: "oklch(0.70 0.19 45 / 40%)",
              borderWidth: "1px",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap
                    className="w-5 h-5"
                    style={{ color: "oklch(0.70 0.19 45)" }}
                    aria-hidden
                  />
                  <h3 className="font-display font-bold text-lg text-foreground">
                    GravityMode
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time obstacle detection & safe navigation using your
                  phone camera
                </p>
              </div>
              <Badge
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "oklch(0.70 0.19 45 / 20%)",
                  color: "oklch(0.70 0.19 45)",
                  border: "1px solid oklch(0.70 0.19 45 / 40%)",
                }}
              >
                Vision AI
              </Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Obstacle & hazard detection
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Voice & haptic feedback
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Hands-free operation
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigate("gravity")}
              className="w-full py-3 rounded-lg font-display font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
              style={{
                backgroundColor: "oklch(0.70 0.19 45)",
                color: "oklch(0.08 0.002 286)",
              }}
              aria-label="Activate GravityMode"
              data-ocid="dashboard.primary_button"
            >
              ACTIVATE MODE
            </button>
          </div>

          <div
            className="card-dark rounded-xl p-6 flex flex-col gap-4"
            style={{
              borderColor: "oklch(0.52 0.22 261 / 40%)",
              borderWidth: "1px",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: "oklch(0.52 0.22 261)" }}
                    aria-hidden
                  />
                  <h3 className="font-display font-bold text-lg text-foreground">
                    EarthMode
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  GPS + camera guided navigation for blind & visually impaired
                  users
                </p>
              </div>
              <Badge
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "oklch(0.52 0.22 261 / 20%)",
                  color: "oklch(0.52 0.22 261)",
                  border: "1px solid oklch(0.52 0.22 261 / 40%)",
                }}
              >
                GPS + AI
              </Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Turn-by-turn guidance
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Landmark announcements
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3" aria-hidden />
                Off-route detection
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigate("earth")}
              className="w-full py-3 rounded-lg font-display font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
              style={{
                backgroundColor: "oklch(0.52 0.22 261)",
                color: "oklch(0.08 0.002 286)",
              }}
              aria-label="Activate EarthMode"
              data-ocid="dashboard.primary_button"
            >
              ACTIVATE MODE
            </button>
          </div>
        </div>
      </motion.div>

      <VoicePanel
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
