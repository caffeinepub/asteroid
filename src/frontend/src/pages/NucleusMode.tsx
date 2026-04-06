import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Crosshair,
  Loader2,
  MapPin,
  Navigation,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppPage } from "../App";

interface NucleusModeProps {
  onNavigate: (page: AppPage) => void;
}

const ROUTE_UPDATES = [
  "Head north on Main Street",
  "Turn left onto Oak Avenue in 50m",
  "Crossing intersection — wait for signal",
  "Turn right onto Park Road in 200m",
  "Bus stop on your left in 30m",
  "Continue straight for 400m",
  "Your destination is on the right",
];

const LANDMARKS = [
  { name: "City Hall Crosswalk", distance: "120m", type: "crossing" },
  { name: "Central Coffee", distance: "200m", type: "business" },
  { name: "Bus Stop #47", distance: "280m", type: "transit" },
  { name: "Riverside Park Entrance", distance: "400m", type: "landmark" },
];

export default function NucleusModePage({ onNavigate }: NucleusModeProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState("");
  const [activeDestination, setActiveDestination] = useState("");
  const [routeStep, setRouteStep] = useState(0);
  const [distanceToTurn, setDistanceToTurn] = useState(350);
  const [eta, setEta] = useState(12);
  const [currentStreet, setCurrentStreet] = useState("Main Street");

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsPosition, setGpsPosition] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const firstFixRef = useRef(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1;
    window.speechSynthesis.speak(utt);
  }, []);

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError(
        "GPS is not supported on this device. Navigation will use simulated data.",
      );
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    firstFixRef.current = false;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsPosition({ lat: latitude, lng: longitude, accuracy });
        setGpsLoading(false);

        if (!firstFixRef.current) {
          firstFixRef.current = true;
          speak("Location acquired. Starting navigation.");
          navigator.vibrate?.([100, 50, 100]);
        } else {
          speak("Location updated.");
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(
            "Location permission was denied. Please allow location access and try again.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError(
            "Location unavailable. Check that GPS is enabled on your device.",
          );
        } else if (err.code === err.TIMEOUT) {
          setGpsError("Location request timed out. Please try again.");
        } else {
          setGpsError("Unable to get location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGps();
    };
  }, [stopGps]);

  // Simulated route timer
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setInterval(() => {
      setDistanceToTurn((d) => {
        if (d <= 30) {
          setRouteStep((s) => {
            const next = (s + 1) % ROUTE_UPDATES.length;
            speak(ROUTE_UPDATES[next]);
            return next;
          });
          setCurrentStreet((s) =>
            s === "Main Street" ? "Oak Avenue" : "Main Street",
          );
          return 300;
        }
        return d - 15;
      });
      setEta((e) => Math.max(0, e - 0.1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isNavigating, speak]);

  const handleStart = useCallback(() => {
    if (!destination.trim()) return;
    setActiveDestination(destination);
    setIsNavigating(true);
    setRouteStep(0);
    setDistanceToTurn(350);
    setEta(12);
    startGps();
    speak(`Starting navigation to ${destination}.`);
  }, [destination, startGps, speak]);

  const handleStop = useCallback(() => {
    setIsNavigating(false);
    setDistanceToTurn(350);
    setEta(12);
    stopGps();
    setGpsPosition(null);
    setGpsLoading(false);
    speak("Navigation stopped.");
  }, [stopGps, speak]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.07 0.002 286)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground active:opacity-60 transition-all duration-150 mb-8 min-h-[44px]"
          aria-label="Back to dashboard"
          data-ocid="earth.link"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          Back to Dashboard
        </button>

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
              GPS-guided travel companion
            </p>
          </div>
        </div>

        {/* GPS status panel — always visible when navigating */}
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 mb-5 flex items-center gap-3"
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
              <>
                <Loader2
                  className="w-5 h-5 animate-spin flex-shrink-0"
                  style={{ color: "oklch(0.52 0.22 261)" }}
                  aria-hidden
                />
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.52 0.22 261)" }}
                  data-ocid="earth.loading_state"
                >
                  Acquiring GPS signal…
                </p>
              </>
            )}
            {gpsError && (
              <>
                <MapPin
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "oklch(0.62 0.22 25)" }}
                  aria-hidden
                />
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.85 0.12 25)" }}
                  data-ocid="earth.error_state"
                >
                  {gpsError}
                </p>
              </>
            )}
            {gpsPosition && !gpsError && !gpsLoading && (
              <>
                <Crosshair
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "oklch(0.78 0.16 155)" }}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.78 0.16 155)" }}
                  >
                    GPS Active
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {gpsPosition.lat.toFixed(5)}, {gpsPosition.lng.toFixed(5)}
                    &nbsp;·&nbsp;±{Math.round(gpsPosition.accuracy)}m
                  </p>
                </div>
                <span
                  className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
                  aria-hidden
                />
              </>
            )}
          </motion.div>
        )}

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
                  placeholder="Enter destination or say a place name..."
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
              {[
                "Central Hospital",
                "City Library",
                "Union Station",
                "Main Park",
              ].map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => setDestination(place)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 active:scale-[0.97] active:opacity-70"
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
              ))}
            </div>
          </motion.div>
        )}

        {isNavigating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
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

            <div
              className="rounded-2xl p-6 mb-4"
              style={{
                backgroundColor: "oklch(0.11 0.005 260)",
                border: "2px solid oklch(0.52 0.22 261 / 40%)",
              }}
            >
              <motion.div
                key={routeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 mb-6"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "oklch(0.52 0.22 261)",
                    color: "oklch(0.08 0.002 286)",
                  }}
                >
                  <ChevronRight className="w-6 h-6" aria-hidden />
                </div>
                <div>
                  <p
                    className="font-display font-bold text-xl text-foreground"
                    aria-live="polite"
                  >
                    {ROUTE_UPDATES[routeStep]}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    in {distanceToTurn}m
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <Crosshair className="w-3 h-3" aria-hidden />
                    Current Street
                  </div>
                  <p className="font-display font-bold text-sm text-foreground">
                    {currentStreet}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <Navigation className="w-3 h-3" aria-hidden />
                    Next Turn
                  </div>
                  <p className="font-display font-bold text-sm text-foreground">
                    {distanceToTurn}m
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                    <Clock className="w-3 h-3" aria-hidden />
                    ETA
                  </div>
                  <p className="font-display font-bold text-sm text-foreground">
                    {Math.ceil(eta)} min
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-4 mb-4 flex items-center gap-3"
              style={{
                backgroundColor: "oklch(0.12 0.05 261 / 30%)",
                border: "1px solid oklch(0.52 0.22 261 / 30%)",
              }}
            >
              <Volume2
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "oklch(0.52 0.22 261)" }}
                aria-hidden
              />
              <p className="text-sm text-foreground" aria-live="polite">
                {ROUTE_UPDATES[routeStep]}
              </p>
            </div>
          </motion.div>
        )}

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

        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
        >
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Upcoming Points of Interest
          </h2>
          <div className="flex flex-col gap-3">
            {LANDMARKS.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
                data-ocid={`earth.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "oklch(0.52 0.22 261 / 20%)" }}
                  >
                    <MapPin
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.22 261)" }}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.type}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.52 0.22 261)" }}
                >
                  {item.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
