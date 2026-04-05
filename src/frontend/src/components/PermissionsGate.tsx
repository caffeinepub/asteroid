import {
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Mic,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AsteroidLogo from "./AsteroidLogo";

type PermStatus = "idle" | "pending" | "granted" | "denied";

interface PermState {
  camera: PermStatus;
  microphone: PermStatus;
  location: PermStatus;
}

interface PermissionsGateProps {
  onComplete: () => void;
}

const PERM_ITEMS = [
  {
    key: "camera" as const,
    label: "Camera",
    sublabel: "Object detection & GravityMode",
    Icon: Camera,
  },
  {
    key: "microphone" as const,
    label: "Microphone",
    sublabel: "Voice commands & Aster AI",
    Icon: Mic,
  },
  {
    key: "location" as const,
    label: "Location",
    sublabel: "EarthMode GPS navigation",
    Icon: MapPin,
  },
];

function StatusBadge({ status }: { status: PermStatus }) {
  if (status === "idle") {
    return (
      <span
        className="telemetry text-[10px] px-2 py-0.5 border"
        style={{
          color: "oklch(0.55 0.008 220)",
          borderColor: "oklch(0.78 0.18 210 / 18%)",
          background: "oklch(0.09 0.006 235)",
        }}
      >
        STANDBY
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        className="telemetry text-[10px] px-2 py-0.5 border flex items-center gap-1"
        style={{
          color: "oklch(0.87 0.16 84)",
          borderColor: "oklch(0.87 0.16 84 / 35%)",
          background: "oklch(0.87 0.16 84 / 8%)",
        }}
      >
        <Loader2 size={9} className="animate-spin" />
        REQUESTING
      </span>
    );
  }
  if (status === "granted") {
    return (
      <span
        className="telemetry text-[10px] px-2 py-0.5 border flex items-center gap-1"
        style={{
          color: "oklch(0.78 0.16 155)",
          borderColor: "oklch(0.78 0.16 155 / 35%)",
          background: "oklch(0.78 0.16 155 / 8%)",
        }}
      >
        <CheckCircle2 size={9} />
        GRANTED
      </span>
    );
  }
  return (
    <span
      className="telemetry text-[10px] px-2 py-0.5 border flex items-center gap-1"
      style={{
        color: "oklch(0.65 0.22 25)",
        borderColor: "oklch(0.65 0.22 25 / 35%)",
        background: "oklch(0.65 0.22 25 / 8%)",
      }}
    >
      <XCircle size={9} />
      DENIED
    </span>
  );
}

export default function PermissionsGate({ onComplete }: PermissionsGateProps) {
  const [perms, setPerms] = useState<PermState>({
    camera: "idle",
    microphone: "idle",
    location: "idle",
  });
  const [phase, setPhase] = useState<"intro" | "requesting" | "done">("intro");

  const setPermStatus = (key: keyof PermState, status: PermStatus) =>
    setPerms((prev) => ({ ...prev, [key]: status }));

  const handleGrantAll = async () => {
    setPhase("requesting");

    // Camera
    setPermStatus("camera", "pending");
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      for (const track of camStream.getTracks()) track.stop();
      setPermStatus("camera", "granted");
    } catch {
      setPermStatus("camera", "denied");
    }

    // Microphone
    setPermStatus("microphone", "pending");
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      for (const track of micStream.getTracks()) track.stop();
      setPermStatus("microphone", "granted");
    } catch {
      setPermStatus("microphone", "denied");
    }

    // Location
    setPermStatus("location", "pending");
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermStatus("location", "granted");
          resolve();
        },
        () => {
          setPermStatus("location", "denied");
          resolve();
        },
        { timeout: 10000, enableHighAccuracy: false },
      );
    });

    // Mark as done and store in localStorage
    localStorage.setItem("asteroid_permissions_requested", "1");
    setPhase("done");
  };

  const handleContinue = () => {
    onComplete();
  };

  const allDone = phase === "done";
  const isRequesting = phase === "requesting";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center hud-grid-bg"
      style={{ background: "oklch(0.04 0.005 240)" }}
      data-ocid="permissions.modal"
    >
      {/* Ambient glow orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 210 / 6%) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Card */}
        <div
          className="clip-corner hud-glow"
          style={{
            background: "oklch(0.065 0.006 235)",
            border: "1px solid oklch(0.78 0.18 210 / 22%)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-8 pb-6 flex flex-col items-center text-center"
            style={{ borderBottom: "1px solid oklch(0.78 0.18 210 / 10%)" }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
              className="mb-4"
            >
              <AsteroidLogo size={52} />
            </motion.div>

            <div
              className="telemetry text-[10px] mb-2"
              style={{ color: "oklch(0.78 0.18 210 / 60%)" }}
            >
              ASTEROID — INITIALIZATION
            </div>

            <h1
              className="text-xl font-bold tracking-tight mb-2"
              style={{ color: "oklch(0.97 0.004 220)" }}
            >
              Device Access Required
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.55 0.008 220)" }}
            >
              Asteroid needs access to your device sensors for full
              functionality. Grant the permissions below to enable all features.
            </p>
          </div>

          {/* Permission rows */}
          <div className="px-6 py-5 flex flex-col gap-3">
            {PERM_ITEMS.map(({ key, label, sublabel, Icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-4 p-3"
                style={{
                  background: "oklch(0.09 0.006 235)",
                  border: "1px solid oklch(0.78 0.18 210 / 10%)",
                }}
                data-ocid={`permissions.${key}.row`}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
                  style={{
                    background:
                      perms[key] === "granted"
                        ? "oklch(0.78 0.16 155 / 12%)"
                        : perms[key] === "denied"
                          ? "oklch(0.65 0.22 25 / 12%)"
                          : "oklch(0.78 0.18 210 / 10%)",
                    border: `1px solid ${
                      perms[key] === "granted"
                        ? "oklch(0.78 0.16 155 / 25%)"
                        : perms[key] === "denied"
                          ? "oklch(0.65 0.22 25 / 25%)"
                          : "oklch(0.78 0.18 210 / 20%)"
                    }`,
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color:
                        perms[key] === "granted"
                          ? "oklch(0.78 0.16 155)"
                          : perms[key] === "denied"
                            ? "oklch(0.65 0.22 25)"
                            : "oklch(0.78 0.18 210)",
                    }}
                  />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.92 0.004 220)" }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.5 0.008 220)" }}
                  >
                    {sublabel}
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={perms[key]} />
              </motion.div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="px-6 pb-7 pt-1 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {!allDone && (
                <motion.button
                  key="grant"
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  onClick={handleGrantAll}
                  disabled={isRequesting}
                  className="w-full py-3 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 clip-corner transition-all duration-200"
                  style={{
                    background: isRequesting
                      ? "oklch(0.78 0.18 210 / 30%)"
                      : "oklch(0.78 0.18 210)",
                    color: isRequesting
                      ? "oklch(0.78 0.18 210)"
                      : "oklch(0.04 0.005 240)",
                    cursor: isRequesting ? "not-allowed" : "pointer",
                    border: isRequesting
                      ? "1px solid oklch(0.78 0.18 210 / 40%)"
                      : "none",
                  }}
                  data-ocid="permissions.grant_all.button"
                >
                  {isRequesting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      REQUESTING ACCESS...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      GRANT ALL PERMISSIONS
                    </>
                  )}
                </motion.button>
              )}

              {allDone && (
                <motion.button
                  key="continue"
                  type="button"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "backOut" }}
                  onClick={handleContinue}
                  className="w-full py-3 text-sm font-semibold tracking-wide clip-corner"
                  style={{
                    background: "oklch(0.78 0.18 210)",
                    color: "oklch(0.04 0.005 240)",
                  }}
                  data-ocid="permissions.continue.button"
                >
                  CONTINUE TO ASTEROID →
                </motion.button>
              )}
            </AnimatePresence>

            {!allDone && !isRequesting && (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("asteroid_permissions_requested", "1");
                  onComplete();
                }}
                className="w-full py-2 text-xs text-center transition-colors"
                style={{ color: "oklch(0.42 0.008 220)" }}
                data-ocid="permissions.skip.button"
              >
                Skip for now
              </button>
            )}

            {allDone && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="telemetry text-[10px] text-center"
                style={{ color: "oklch(0.45 0.008 220)" }}
              >
                Denied permissions can be re-enabled in your browser settings
              </motion.p>
            )}
          </div>
        </div>

        {/* Corner accent lines */}
        <div
          className="absolute -bottom-3 -left-3 w-6 h-6 pointer-events-none"
          style={{
            borderBottom: "1px solid oklch(0.78 0.18 210 / 40%)",
            borderLeft: "1px solid oklch(0.78 0.18 210 / 40%)",
          }}
        />
        <div
          className="absolute -top-3 -right-3 w-6 h-6 pointer-events-none"
          style={{
            borderTop: "1px solid oklch(0.78 0.18 210 / 40%)",
            borderRight: "1px solid oklch(0.78 0.18 210 / 40%)",
          }}
        />
      </motion.div>
    </div>
  );
}
