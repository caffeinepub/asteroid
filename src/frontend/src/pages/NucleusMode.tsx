import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Crosshair,
  Eye,
  Loader2,
  MapPin,
  Navigation,
  Play,
  Square,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";

interface NucleusModeProps {
  onNavigate: (page: AppPage) => void;
}

type DetectedObject = {
  class: string;
  score: number;
  bbox: [number, number, number, number];
};

function bboxColor(
  bbox: [number, number, number, number],
  vidW: number,
  vidH: number,
): string {
  const area = (bbox[2] * bbox[3]) / (vidW * vidH);
  if (area > 0.25) return "#ff4444";
  if (area > 0.08) return "#ffaa00";
  return "#00ff88";
}

function statusFromDetections(
  objs: DetectedObject[],
  W: number,
  H: number,
): "green" | "amber" | "red" {
  if (objs.length === 0) return "green";
  const hasDanger = objs.some(
    (o) => o.class === "person" && (o.bbox[2] * o.bbox[3]) / (W * H) > 0.25,
  );
  if (hasDanger || objs.length >= 4) return "red";
  if (objs.length >= 2) return "amber";
  return "green";
}

const STATUS_COLOR = { green: "#00ff88", amber: "#ffaa00", red: "#ff4444" };
const STATUS_LABEL = {
  green: "Clear",
  amber: "Objects detected",
  red: "Obstacle!",
};

export default function NucleusModePage({ onNavigate }: NucleusModeProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState("");
  const [activeDestination, setActiveDestination] = useState("");

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsPosition, setGpsPosition] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    heading?: number | null;
  } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const firstFixRef = useRef(false);

  // Camera + COCO-SSD state
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
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1;
    window.speechSynthesis.speak(utt);
  }, []);

  // GPS
  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS not supported on this device.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    firstFixRef.current = false;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading } = pos.coords;
        setGpsPosition({ lat: latitude, lng: longitude, accuracy, heading });
        setGpsLoading(false);
        if (!firstFixRef.current) {
          firstFixRef.current = true;
          speak("GPS acquired. Camera vision active. Navigate safely.");
          navigator.vibrate?.([100, 50, 100]);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(
            "Location permission denied. Allow access and try again.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("Location unavailable. Check GPS is enabled.");
        } else {
          setGpsError("Unable to get location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [speak]);

  // Camera
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
      setCameraError("Camera not supported in this browser.");
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
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      const error = err as DOMException;
      if (error.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Allow access and try again.");
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
      setCameraError("Failed to load AI model. Please refresh.");
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
            const color = bboxColor(
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
            const label = `${p.class} ${Math.round(p.score * 100)}%`;
            ctx.font = "bold 13px monospace";
            const tw = ctx.measureText(label).width;
            ctx.fillStyle = color;
            ctx.fillRect(x, y - 20, tw + 10, 20);
            ctx.fillStyle = "#0a0a0f";
            ctx.fillText(label, x + 5, y - 5);
          }
        }

        const newDetections = preds.map((p) => ({
          class: p.class,
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }));
        setDetections(newDetections);

        // Voice announcements (3s debounce per class)
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

        // Haptics on close objects
        const closeDanger = newDetections.some((d) => {
          const area = (d.bbox[2] * d.bbox[3]) / (W * H);
          return area > 0.25;
        });
        if (closeDanger) navigator.vibrate?.([100, 50, 100]);

        // Update log
        if (newDetections.length > 0) {
          const label = `${newDetections[0].class} ${Math.round(newDetections[0].score * 100)}%`;
          setDetectionLog((prev) =>
            [{ text: label, id: Date.now() }, ...prev].slice(0, 6),
          );
        }

        rafRef.current = requestAnimationFrame(runDetection);
      })
      .catch(() => {
        rafRef.current = requestAnimationFrame(runDetection);
      });
  }, [speak]);

  // Wire up detection loop
  useEffect(() => {
    if (isNavigating && modelReady && hasCameraStream) {
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
  }, [isNavigating, modelReady, hasCameraStream, runDetection]);

  // Load model and start camera when navigation starts
  useEffect(() => {
    if (isNavigating) {
      startCamera();
      loadModel();
    } else {
      stopCamera();
    }
  }, [isNavigating, startCamera, stopCamera, loadModel]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopGps();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopCamera();
    };
  }, [stopGps, stopCamera]);

  const handleStart = useCallback(() => {
    if (!destination.trim()) return;
    setActiveDestination(destination);
    setIsNavigating(true);
    setDetectionLog([]);
    startGps();
    speak(
      `Starting navigation to ${destination}. Camera vision and GPS are active.`,
    );
  }, [destination, startGps, speak]);

  const handleStop = useCallback(() => {
    setIsNavigating(false);
    stopGps();
    setGpsPosition(null);
    setGpsLoading(false);
    setGpsError(null);
    setDetectionLog([]);
    speak("Navigation stopped.");
  }, [stopGps, speak]);

  const W = videoRef.current?.videoWidth || 640;
  const H = videoRef.current?.videoHeight || 480;
  const visionStatus = statusFromDetections(detections, W, H);
  const visionColor = STATUS_COLOR[visionStatus];
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
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-150 mb-8 min-h-[44px]"
          aria-label="Back to dashboard"
          data-ocid="earth.link"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "oklch(0.12 0.05 261)",
              border: "1px solid oklch(0.52 0.22 261 / 40%)",
            }}
          >
            <Navigation
              className="w-6 h-6"
              style={{ color: "oklch(0.52 0.22 261)" }}
              aria-hidden
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              NucleusMode
            </h1>
            <p className="text-sm text-muted-foreground">
              GPS navigation · COCO-SSD vision · real-time awareness
            </p>
          </div>
        </div>

        {/* Destination input (when not navigating) */}
        {!isNavigating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 mb-6"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
              Set Destination
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination or address…"
                  className="pl-9 bg-muted text-foreground placeholder:text-muted-foreground"
                  aria-label="Enter destination"
                  data-ocid="earth.input"
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                />
              </div>
              <Button
                onClick={handleStart}
                disabled={!destination.trim()}
                className="font-semibold transition-all duration-150 active:scale-[0.97]"
                style={{
                  backgroundColor: "oklch(0.52 0.22 261)",
                  color: "oklch(0.98 0 0)",
                }}
                aria-label="Start navigation"
                data-ocid="earth.primary_button"
              >
                Go
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Hospital", "Train Station", "Airport", "Library"].map(
                (place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setDestination(place)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      backgroundColor: "oklch(0.15 0.007 270)",
                      color: "oklch(0.76 0.009 264)",
                      border: "1px solid oklch(0.92 0.005 260 / 20%)",
                    }}
                    aria-label={`Navigate to ${place}`}
                    data-ocid="earth.button"
                  >
                    {place}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        )}

        {/* Active navigation — split layout */}
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            {/* Destination badge */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin
                className="w-4 h-4"
                style={{ color: "oklch(0.52 0.22 261)" }}
                aria-hidden
              />
              <span className="text-sm text-muted-foreground">
                Navigating to:
              </span>
              <Badge
                style={{
                  backgroundColor: "oklch(0.52 0.22 261 / 20%)",
                  color: "oklch(0.52 0.22 261)",
                  border: "1px solid oklch(0.52 0.22 261 / 40%)",
                }}
              >
                {activeDestination}
              </Badge>
            </div>

            {/* TOP PANEL — Camera + vision */}
            <div
              className="rounded-2xl overflow-hidden mb-4 relative"
              style={{
                border: `2px solid ${visionColor}44`,
                backgroundColor: "oklch(0.06 0.002 270)",
                minHeight: "240px",
              }}
              data-ocid="earth.async_state"
            >
              {/* Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full object-cover"
                style={{
                  display: hasCameraStream ? "block" : "none",
                  maxHeight: "360px",
                }}
                aria-label="Live camera feed for navigation"
              />
              {/* Canvas bounding boxes */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: hasCameraStream ? "block" : "none" }}
                aria-hidden
              />

              {/* Model loading */}
              {modelLoading && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30"
                  style={{ backgroundColor: "oklch(0.06 0.002 270 / 90%)" }}
                  data-ocid="earth.loading_state"
                >
                  <Loader2
                    className="w-10 h-10 animate-spin"
                    style={{ color: "oklch(0.52 0.22 261)" }}
                    aria-hidden
                  />
                  <p
                    className="text-sm font-mono"
                    style={{ color: "oklch(0.52 0.22 261)" }}
                  >
                    Loading AI vision model…
                  </p>
                </div>
              )}

              {/* Camera error */}
              {cameraError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30 px-6 text-center"
                  style={{ backgroundColor: "oklch(0.06 0.002 270 / 90%)" }}
                  data-ocid="earth.error_state"
                >
                  <CameraOff
                    className="w-12 h-12"
                    style={{ color: "oklch(0.62 0.22 25)" }}
                    aria-hidden
                  />
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.85 0.12 25)" }}
                  >
                    {cameraError}
                  </p>
                </div>
              )}

              {/* Camera starting */}
              {!hasCameraStream && !cameraError && !modelLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 min-h-[240px]">
                  <Camera
                    className="w-12 h-12 text-muted-foreground"
                    aria-hidden
                  />
                  <p className="text-sm text-muted-foreground font-mono">
                    Starting camera…
                  </p>
                </div>
              )}

              {/* HUD detections — top right */}
              {topDetections.length > 0 && (
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
                  {topDetections.map((d, i) => {
                    const col = bboxColor(d.bbox, W, H);
                    return (
                      <div
                        key={`${d.class}-${i}`}
                        className="px-2 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5"
                        style={{
                          backgroundColor: "oklch(0.07 0.002 286 / 85%)",
                          border: `1px solid ${col}`,
                          color: col,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: col }}
                          aria-hidden
                        />
                        {d.class} {Math.round(d.score * 100)}%
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Camera label */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <div
                  className="px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs font-mono"
                  style={{
                    backgroundColor: "oklch(0.07 0.002 286 / 85%)",
                    border: "1px solid oklch(0.52 0.22 261 / 40%)",
                    color: "oklch(0.52 0.22 261)",
                  }}
                >
                  <Eye className="w-3 h-3" aria-hidden />
                  AI VISION
                </div>
              </div>

              {/* Status pill — bottom */}
              {hasCameraStream && modelReady && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                  <div
                    className="px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold font-mono"
                    style={{
                      backgroundColor: "oklch(0.07 0.002 286 / 85%)",
                      border: `1px solid ${visionColor}`,
                      color: visionColor,
                    }}
                    aria-live="polite"
                    aria-label={`Vision: ${STATUS_LABEL[visionStatus]}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: visionColor }}
                      aria-hidden
                    />
                    {STATUS_LABEL[visionStatus]} · {detections.length} obj
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM PANEL — GPS info */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: gpsError
                  ? "oklch(0.12 0.04 25)"
                  : gpsLoading
                    ? "oklch(0.12 0.04 261)"
                    : "oklch(0.10 0.04 155)",
                border: `1px solid ${
                  gpsError
                    ? "oklch(0.62 0.22 25 / 50%)"
                    : gpsLoading
                      ? "oklch(0.52 0.22 261 / 40%)"
                      : "oklch(0.78 0.16 155 / 40%)"
                }`,
              }}
              aria-live="polite"
              data-ocid="earth.panel"
            >
              {gpsLoading && (
                <div className="flex items-center gap-3">
                  <Loader2
                    className="w-5 h-5 animate-spin flex-shrink-0"
                    style={{ color: "oklch(0.52 0.22 261)" }}
                    aria-hidden
                  />
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.52 0.22 261)" }}
                  >
                    Acquiring GPS signal…
                  </p>
                </div>
              )}
              {gpsError && (
                <div className="flex items-center gap-3">
                  <MapPin
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "oklch(0.62 0.22 25)" }}
                    aria-hidden
                  />
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.85 0.12 25)" }}
                  >
                    {gpsError}
                  </p>
                </div>
              )}
              {gpsPosition && !gpsError && !gpsLoading && (
                <div className="flex items-start gap-3">
                  <Crosshair
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "oklch(0.78 0.16 155)" }}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.78 0.16 155)" }}
                      >
                        GPS Active
                      </p>
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
                        aria-hidden
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Latitude
                        </p>
                        <p className="text-xs font-mono text-foreground">
                          {gpsPosition.lat.toFixed(6)}°
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Longitude
                        </p>
                        <p className="text-xs font-mono text-foreground">
                          {gpsPosition.lng.toFixed(6)}°
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Accuracy
                        </p>
                        <p className="text-xs font-mono text-foreground">
                          ±{Math.round(gpsPosition.accuracy)}m
                        </p>
                      </div>
                      {gpsPosition.heading != null && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Heading
                          </p>
                          <p className="text-xs font-mono text-foreground">
                            {Math.round(gpsPosition.heading)}°
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detection log */}
            {detectionLog.length > 0 && (
              <div
                className="rounded-xl p-4 mt-4"
                style={{
                  backgroundColor: "oklch(0.11 0.005 260)",
                  border: "1px solid oklch(0.92 0.005 260 / 15%)",
                }}
                aria-live="polite"
                aria-label="Live detection log"
              >
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                  <Eye className="w-3 h-3" aria-hidden /> Live Detections
                </h3>
                <div className="flex flex-col gap-1.5">
                  {detectionLog.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-xs"
                      data-ocid={`earth.item.${i + 1}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            i === 0
                              ? "oklch(0.78 0.16 155)"
                              : "oklch(0.52 0.22 261)",
                        }}
                        aria-hidden
                      />
                      <span
                        className={`font-mono ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Start/Stop button */}
        <button
          type="button"
          onClick={isNavigating ? handleStop : handleStart}
          disabled={!isNavigating && !destination.trim()}
          className="w-full py-5 rounded-xl font-display font-bold text-xl uppercase tracking-widest text-background flex items-center justify-center gap-3 transition-all duration-150 hover:opacity-90 active:scale-[0.98] mb-6 disabled:opacity-40"
          style={{
            backgroundColor: isNavigating
              ? "oklch(0.62 0.22 25)"
              : "oklch(0.52 0.22 261)",
          }}
          aria-label={isNavigating ? "Stop navigation" : "Start navigation"}
          aria-pressed={isNavigating}
          data-ocid="earth.primary_button"
        >
          {isNavigating ? (
            <>
              <Square className="w-6 h-6" aria-hidden /> STOP NAVIGATION
            </>
          ) : (
            <>
              <Play className="w-6 h-6" aria-hidden /> START NAVIGATION
            </>
          )}
        </button>

        {/* Info card when idle */}
        {!isNavigating && (
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
              How NucleusMode Works
            </h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Navigation,
                  label: "Real GPS",
                  desc: "Live coordinates, accuracy, and heading from your device",
                },
                {
                  icon: Eye,
                  label: "AI Vision",
                  desc: "COCO-SSD detects 80+ objects — people, vehicles, furniture",
                },
                {
                  icon: Camera,
                  label: "Camera HUD",
                  desc: "Live bounding boxes with color-coded threat levels",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.52 0.22 261 / 20%)" }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.22 261)" }}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
