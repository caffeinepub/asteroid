import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle,
  Play,
  Square,
  Vibrate,
  Volume2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";

interface GluonModeProps {
  onNavigate: (page: AppPage) => void;
}

const OVERLAY_READINGS = [
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

export default function GluonModePage({ onNavigate }: GluonModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [currentReading, setCurrentReading] = useState(0);
  const [voiceFeedback, setVoiceFeedback] = useState<
    Array<{ text: string; id: number }>
  >([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.1;
    window.speechSynthesis.speak(utt);
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      for (const t of cameraStreamRef.current.getTracks()) t.stop();
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCameraStream(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is not supported in this browser. Please use a modern browser.",
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setHasCameraStream(true);
      setCameraError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      const error = err as DOMException;
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access and try again.",
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setCameraError(
          "No camera found on this device. Please connect a camera and try again.",
        );
      } else {
        setCameraError(
          `Camera unavailable: ${error.message}. Please check your device settings.`,
        );
      }
    }
  }, []);

  // Start/stop camera when isActive or cameraEnabled changes
  useEffect(() => {
    if (isActive && cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, cameraEnabled, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
      // Access the latest stream value directly
      stopCamera();
    };
  }, [stopCamera]);

  // Simulated scanning overlay
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCurrentReading((i) => {
        const next = (i + 1) % OVERLAY_READINGS.length;
        const reading = OVERLAY_READINGS[next];
        setVoiceFeedback((prev) =>
          [{ text: reading.text, id: Date.now() }, ...prev].slice(0, 5),
        );
        if (audioEnabled) {
          // Speak warnings/dangers
          if (reading.type !== "clear") {
            setTimeout(() => {
              if (window.speechSynthesis) {
                const utt = new SpeechSynthesisUtterance(reading.text);
                utt.rate = 1.1;
                window.speechSynthesis.speak(utt);
              }
            }, 0);
          }
        }
        if (hapticsEnabled && reading.type !== "clear") {
          navigator.vibrate?.([100, 50, 100]);
        }
        return next;
      });
    }, 2500);
    scanTimerRef.current = timer;
    return () => clearInterval(timer);
  }, [isActive, audioEnabled, hapticsEnabled]);

  const handleToggle = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      speak("GluonMode stopped.");
    } else {
      setIsActive(true);
      speak("GluonMode activated. Scanning your environment.");
    }
  }, [isActive, speak]);

  const reading = OVERLAY_READINGS[currentReading];
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
              GluonMode
            </h1>
            <p className="text-sm text-muted-foreground">
              Vision-based obstacle detection & safety navigation
            </p>
          </div>
        </div>

        {/* Camera / detection view */}
        <motion.div
          animate={isActive ? { borderColor: reading.color } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden mb-6 relative"
          style={{
            border: `2px solid ${
              isActive ? reading.color : "oklch(0.70 0.19 45 / 30%)"
            }`,
            backgroundColor: "oklch(0.06 0.002 270)",
            minHeight: "280px",
          }}
        >
          {/* Live camera feed */}
          {isActive && hasCameraStream && !cameraError && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Live camera feed for obstacle detection"
            />
          )}

          {/* Overlay layer on top of video */}
          <div
            className="relative z-10 flex flex-col items-center justify-center h-full p-8 gap-6 min-h-[280px]"
            style={{
              background:
                isActive && hasCameraStream && !cameraError
                  ? "oklch(0.06 0.002 270 / 50%)"
                  : undefined,
            }}
          >
            {cameraError && isActive ? (
              <div
                role="alert"
                aria-live="assertive"
                className="flex flex-col items-center gap-4 text-center"
              >
                <CameraOff
                  className="w-14 h-14"
                  style={{ color: "oklch(0.62 0.22 25)" }}
                  aria-hidden
                />
                <p
                  className="text-sm font-medium max-w-xs"
                  style={{ color: "oklch(0.85 0.12 25)" }}
                  data-ocid="gravity.error_state"
                >
                  {cameraError}
                </p>
                <p className="text-xs text-muted-foreground">
                  Obstacle detection will continue with audio cues only
                </p>
              </div>
            ) : isActive ? (
              <>
                <motion.div
                  key={currentReading}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <ReadingIcon
                    className="w-16 h-16 drop-shadow-lg"
                    style={{ color: reading.color }}
                    aria-label={reading.text}
                  />
                  <p
                    className="font-display font-bold text-2xl text-center drop-shadow-lg"
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
                  <span className="text-sm text-white/80 drop-shadow">
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
          onClick={handleToggle}
          className="w-full py-5 rounded-xl font-display font-bold text-xl uppercase tracking-widest text-background flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] mb-6"
          style={{
            backgroundColor: isActive
              ? "oklch(0.62 0.22 25)"
              : "oklch(0.70 0.19 45)",
          }}
          aria-label={
            isActive ? "Stop GluonMode scanning" : "Start GluonMode scanning"
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
            aria-label="Voice feedback log"
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
              Detection Log
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
