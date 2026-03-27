import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle,
  Play,
  Square,
  Vibrate,
  Volume2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AppPage } from "../App";

interface GravityModeProps {
  onNavigate: (page: AppPage) => void;
}

const CAMERA_READINGS = [
  {
    type: "clear",
    text: "Clear path ahead",
    icon: CheckCircle,
    color: "oklch(0.78 0.16 155)",
  },
  {
    type: "warning",
    text: "Person detected — 3m",
    icon: AlertTriangle,
    color: "oklch(0.87 0.16 84)",
  },
  {
    type: "warning",
    text: "Curb detected — 1.5m",
    icon: AlertTriangle,
    color: "oklch(0.70 0.19 45)",
  },
  {
    type: "clear",
    text: "Clear path ahead",
    icon: CheckCircle,
    color: "oklch(0.78 0.16 155)",
  },
  {
    type: "danger",
    text: "Vehicle detected — 5m",
    icon: AlertTriangle,
    color: "oklch(0.62 0.22 25)",
  },
  {
    type: "warning",
    text: "Step down — 0.5m",
    icon: AlertTriangle,
    color: "oklch(0.70 0.19 45)",
  },
  {
    type: "clear",
    text: "Clear path ahead",
    icon: CheckCircle,
    color: "oklch(0.78 0.16 155)",
  },
  {
    type: "warning",
    text: "Door frame — 0.8m",
    icon: AlertTriangle,
    color: "oklch(0.87 0.16 84)",
  },
];

export default function GravityModePage({ onNavigate }: GravityModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [currentReading, setCurrentReading] = useState(0);
  const [voiceFeedback, setVoiceFeedback] = useState<
    Array<{ text: string; id: number }>
  >([]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCurrentReading((i) => {
        const next = (i + 1) % CAMERA_READINGS.length;
        setVoiceFeedback((prev) =>
          [{ text: CAMERA_READINGS[next].text, id: Date.now() }, ...prev].slice(
            0,
            5,
          ),
        );
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [isActive]);

  const reading = CAMERA_READINGS[currentReading];
  const ReadingIcon = reading.icon;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.07 0.002 286)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 min-h-[44px]"
          aria-label="Back to dashboard"
          data-ocid="gravity.link"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "oklch(0.14 0.06 45)",
              border: "1px solid oklch(0.70 0.19 45 / 40%)",
            }}
          >
            <Zap
              className="w-6 h-6"
              style={{ color: "oklch(0.70 0.19 45)" }}
              aria-hidden
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              GravityMode
            </h1>
            <p className="text-sm text-muted-foreground">
              Vision-based obstacle detection & safety navigation
            </p>
          </div>
        </div>

        {/* Main Camera View */}
        <motion.div
          animate={isActive ? { borderColor: reading.color } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            border: `2px solid ${isActive ? reading.color : "oklch(0.70 0.19 45 / 30%)"}`,
            backgroundColor: "oklch(0.09 0.002 270)",
            minHeight: "280px",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-8 gap-6 min-h-[280px]">
            {isActive ? (
              <>
                <motion.div
                  key={currentReading}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <ReadingIcon
                    className="w-16 h-16"
                    style={{ color: reading.color }}
                    aria-label={reading.text}
                  />
                  <p
                    className="font-display font-bold text-2xl text-center"
                    style={{ color: reading.color }}
                    aria-live="assertive"
                  >
                    {reading.text}
                  </p>
                </motion.div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "oklch(0.70 0.19 45)" }}
                    aria-hidden
                  />
                  <span className="text-sm text-muted-foreground">
                    Scanning environment...
                  </span>
                </div>
              </>
            ) : (
              <>
                <Camera
                  className="w-16 h-16 text-muted-foreground"
                  aria-label="Camera inactive"
                />
                <p className="text-muted-foreground text-center">
                  Press <strong className="text-foreground">START</strong> to
                  begin scanning your environment
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Start/Stop button */}
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className="w-full py-5 rounded-xl font-display font-bold text-xl uppercase tracking-widest text-background flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] mb-6"
          style={{
            backgroundColor: isActive
              ? "oklch(0.62 0.22 25)"
              : "oklch(0.70 0.19 45)",
          }}
          aria-label={
            isActive
              ? "Stop GravityMode scanning"
              : "Start GravityMode scanning"
          }
          aria-pressed={isActive}
          data-ocid="gravity.primary_button"
        >
          {isActive ? (
            <>
              <Square className="w-6 h-6" aria-hidden /> STOP SCANNING
            </>
          ) : (
            <>
              <Play className="w-6 h-6" aria-hidden /> START SCANNING
            </>
          )}
        </button>

        {/* Controls */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
        >
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Controls
          </h2>
          <div className="flex flex-col gap-5">
            {[
              {
                icon: Camera,
                label: "Camera",
                description: "Use rear camera for vision",
                checked: cameraEnabled,
                onChange: setCameraEnabled,
                id: "camera-toggle",
              },
              {
                icon: Volume2,
                label: "Audio Feedback",
                description: "Spoken obstacle alerts",
                checked: audioEnabled,
                onChange: setAudioEnabled,
                id: "audio-toggle",
              },
              {
                icon: Vibrate,
                label: "Haptic Feedback",
                description: "Vibration on obstacle detected",
                checked: hapticsEnabled,
                onChange: setHapticsEnabled,
                id: "haptic-toggle",
              },
            ].map(
              ({ icon: Icon, label, description, checked, onChange, id }) => (
                <div
                  key={id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.14 0.06 45 / 50%)" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.70 0.19 45)" }}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={id}
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        {label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={id}
                    checked={checked}
                    onCheckedChange={onChange}
                    aria-label={`Toggle ${label}`}
                    data-ocid="gravity.toggle"
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* Voice Feedback Log */}
        {voiceFeedback.length > 0 && (
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
            aria-live="polite"
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
              Voice Feedback Log
            </h2>
            <div className="flex flex-col gap-2">
              {voiceFeedback.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm"
                  data-ocid={`gravity.item.${i + 1}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "oklch(0.70 0.19 45)" }}
                    aria-hidden
                  />
                  <span
                    className={
                      i === 0
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
