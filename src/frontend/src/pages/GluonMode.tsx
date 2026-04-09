import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import {
  ArrowLeft,
  Camera,
  CameraOff,
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

type DetectedObject = {
  class: string;
  score: number;
  bbox: [number, number, number, number];
};

function getBboxColor(
  bbox: [number, number, number, number],
  vidW: number,
  vidH: number,
): string {
  const area = (bbox[2] * bbox[3]) / (vidW * vidH);
  if (area > 0.25) return "#ff4444";
  if (area > 0.08) return "#ffaa00";
  return "#00ff88";
}

function getStatusFromDetections(
  objs: DetectedObject[],
  vidW: number,
  vidH: number,
): "green" | "amber" | "red" {
  if (objs.length === 0) return "green";
  const hasDangerPerson = objs.some(
    (o) =>
      o.class === "person" && (o.bbox[2] * o.bbox[3]) / (vidW * vidH) > 0.25,
  );
  if (hasDangerPerson || objs.length >= 4) return "red";
  if (objs.length >= 2) return "amber";
  return "green";
}

const STATUS_COLOR = {
  green: "oklch(0.78 0.16 155)",
  amber: "oklch(0.87 0.16 84)",
  red: "oklch(0.62 0.22 25)",
};

const STATUS_TEXT = {
  green: "Path clear",
  amber: "Objects nearby",
  red: "Danger — close obstacle",
};

export default function GluonModePage({ onNavigate }: GluonModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [detectionLog, setDetectionLog] = useState<
    Array<{ text: string; id: number }>
  >([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const rafRef = useRef<number | null>(null);
  const announcedRef = useRef<Map<string, number>>(new Map());

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.1;
    window.speechSynthesis.speak(utt);
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasCameraStream(false);
    setDetections([]);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is not supported in this browser. Please use Chrome or Safari.",
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
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
          "Camera permission denied. Allow camera access and try again.",
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Camera unavailable: ${error.message}`);
      }
    }
  }, []);

  const loadModel = useCallback(async () => {
    if (modelRef.current) return;
    setModelLoading(true);
    try {
      modelRef.current = await cocoSsd.load();
      setModelReady(true);
    } catch {
      setCameraError("Failed to load AI model. Please refresh and try again.");
    } finally {
      setModelLoading(false);
    }
  }, []);

  // Detection loop
  const runDetection = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const model = modelRef.current;
    if (!video || !canvas || !model || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runDetection);
      return;
    }

    const W = video.videoWidth || 640;
    const H = video.videoHeight || 480;
    canvas.width = W;
    canvas.height = H;

    model
      .detect(video)
      .then((preds) => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, W, H);
          for (const p of preds) {
            const [x, y, w, h] = p.bbox;
            const color = getBboxColor(
              p.bbox as [number, number, number, number],
              W,
              H,
            );
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.strokeRect(x, y, w, h);
            ctx.shadowBlur = 0;
            // Label background
            ctx.fillStyle = color;
            const label = `${p.class} ${Math.round(p.score * 100)}%`;
            ctx.font = "bold 14px monospace";
            const tw = ctx.measureText(label).width;
            ctx.fillRect(x, y - 22, tw + 10, 22);
            ctx.fillStyle = "#0a0a0f";
            ctx.fillText(label, x + 5, y - 6);
          }
        }

        const newDetections = preds.map((p) => ({
          class: p.class,
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }));
        setDetections(newDetections);

        // Voice announcements (debounced per class, 3s)
        if (audioEnabled) {
          const now = Date.now();
          for (const d of newDetections) {
            const last = announcedRef.current.get(d.class) ?? 0;
            if (now - last > 3000) {
              announcedRef.current.set(d.class, now);
              const area = (d.bbox[2] * d.bbox[3]) / (W * H);
              const dist =
                area > 0.25 ? "very close" : area > 0.08 ? "nearby" : "ahead";
              speak(`${d.class} ${dist}`);
            }
          }
        }

        // Haptics on danger
        if (hapticsEnabled) {
          const hasDanger = newDetections.some((d) => {
            const area = (d.bbox[2] * d.bbox[3]) / (W * H);
            return area > 0.25 || (d.class === "person" && area > 0.1);
          });
          if (hasDanger) navigator.vibrate?.([100, 50, 100]);
        }

        // Update log
        if (newDetections.length > 0) {
          const topLabel = `${newDetections[0].class} (${Math.round(newDetections[0].score * 100)}%)`;
          setDetectionLog((prev) =>
            [{ text: topLabel, id: Date.now() }, ...prev].slice(0, 8),
          );
        }

        rafRef.current = requestAnimationFrame(runDetection);
      })
      .catch(() => {
        rafRef.current = requestAnimationFrame(runDetection);
      });
  }, [audioEnabled, hapticsEnabled, speak]);

  // Start inference when model + video are ready
  useEffect(() => {
    if (isActive && modelReady && hasCameraStream) {
      rafRef.current = requestAnimationFrame(runDetection);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, modelReady, hasCameraStream, runDetection]);

  // Manage camera on/off
  useEffect(() => {
    if (isActive && cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, cameraEnabled, startCamera, stopCamera]);

  // Load model when activated
  useEffect(() => {
    if (isActive && !modelRef.current) {
      loadModel();
    }
  }, [isActive, loadModel]);

  // Cleanup
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopCamera();
    },
    [stopCamera],
  );

  const handleToggle = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      speak("GluonMode stopped.");
      setDetectionLog([]);
    } else {
      setIsActive(true);
      speak("GluonMode activated. Scanning your environment.");
    }
  }, [isActive, speak]);

  const W = videoRef.current?.videoWidth || 640;
  const H = videoRef.current?.videoHeight || 480;
  const status = getStatusFromDetections(detections, W, H);
  const statusColor = STATUS_COLOR[status];
  const topDetections = detections.slice(0, 5);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.07 0.002 286)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
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
        <div className="flex items-center gap-3 mb-6">
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
              Vision-based obstacle detection · COCO-SSD AI
            </p>
          </div>
        </div>

        {/* Model loading state */}
        {modelLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{
              backgroundColor: "oklch(0.12 0.06 45 / 40%)",
              border: "1px solid oklch(0.70 0.19 45 / 40%)",
            }}
            aria-live="polite"
            data-ocid="gravity.loading_state"
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
              style={{
                borderColor: "oklch(0.70 0.19 45)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-sm" style={{ color: "oklch(0.70 0.19 45)" }}>
              Loading COCO-SSD AI model…
            </p>
          </motion.div>
        )}

        {/* Camera + detection view */}
        <motion.div
          animate={isActive ? { borderColor: statusColor } : {}}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden mb-5 relative"
          style={{
            border: `2px solid ${isActive ? statusColor : "oklch(0.70 0.19 45 / 30%)"}`,
            backgroundColor: "oklch(0.06 0.002 270)",
            minHeight: "280px",
          }}
        >
          {/* Live camera feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              display: hasCameraStream ? "block" : "none",
              maxHeight: "400px",
            }}
            aria-label="Live camera feed"
          />
          {/* Bounding box canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: hasCameraStream ? "block" : "none" }}
            aria-hidden
          />

          {/* HUD overlay — top-right detected objects list */}
          {isActive && topDetections.length > 0 && (
            <div
              className="absolute top-3 right-3 flex flex-col gap-1.5 z-20"
              aria-label="Detected objects"
              data-ocid="gravity.async_state"
            >
              {topDetections.map((d, i) => {
                const col = getBboxColor(d.bbox, W, H);
                return (
                  <div
                    key={`${d.class}-${i}`}
                    className="px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5"
                    style={{
                      backgroundColor: "oklch(0.07 0.002 286 / 85%)",
                      border: `1px solid ${col}`,
                      color: col,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: col }}
                      aria-hidden
                    />
                    {d.class} {Math.round(d.score * 100)}%
                  </div>
                );
              })}
            </div>
          )}

          {/* Status overlay — center/bottom */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-5 pointer-events-none z-20"
            style={{ display: isActive && hasCameraStream ? "flex" : "none" }}
          >
            <div
              className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold font-mono"
              style={{
                backgroundColor: "oklch(0.07 0.002 286 / 80%)",
                border: `1px solid ${statusColor}`,
                color: statusColor,
              }}
              aria-live="polite"
              aria-label={`Status: ${STATUS_TEXT[status]}`}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor }}
                aria-hidden
              />
              {STATUS_TEXT[status]}
            </div>
          </div>

          {/* Inactive / error state */}
          {(!isActive || (!hasCameraStream && !cameraError)) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 min-h-[280px]">
              {cameraError && isActive ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex flex-col items-center gap-3 text-center px-6"
                >
                  <CameraOff
                    className="w-14 h-14"
                    style={{ color: "oklch(0.62 0.22 25)" }}
                    aria-hidden
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.85 0.12 25)" }}
                    data-ocid="gravity.error_state"
                  >
                    {cameraError}
                  </p>
                </div>
              ) : (
                <>
                  <Camera
                    className="w-16 h-16 text-muted-foreground"
                    aria-label="Camera inactive"
                  />
                  <p className="text-muted-foreground text-center px-6">
                    Press <strong className="text-foreground">START</strong> to
                    begin scanning your environment
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Start/Stop button */}
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

        {/* Detection log */}
        {detectionLog.length > 0 && (
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
            aria-live="polite"
            aria-label="Detection log"
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
              Detection Log
            </h2>
            <div className="flex flex-col gap-2">
              {detectionLog.map((item, i) => (
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
                        ? "text-foreground font-mono font-medium"
                        : "text-muted-foreground font-mono"
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
