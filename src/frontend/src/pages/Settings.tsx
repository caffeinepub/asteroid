import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Contrast,
  Globe,
  HelpCircle,
  Loader2,
  MapPin,
  Mic,
  Save,
  ShieldCheck,
  Vibrate,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { usePreferences, useSavePreferences } from "../hooks/useQueries";

interface SettingsPageProps {
  onNavigate: (page: AppPage) => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
];

type PermissionStatus = "granted" | "denied" | "prompt" | "unknown";

interface DevicePermissions {
  microphone: PermissionStatus;
  camera: PermissionStatus;
  location: PermissionStatus;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { data: prefs, isLoading } = usePreferences();
  const savePrefs = useSavePreferences();

  const [wakeWord, setWakeWord] = useState("Hey Asteroid");
  const [speechRate, setSpeechRate] = useState(5);
  const [language, setLanguage] = useState("en");
  const [highContrast, setHighContrast] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [mode, setMode] = useState("Standard");

  const [permissions, setPermissions] = useState<DevicePermissions>({
    microphone: "unknown",
    camera: "unknown",
    location: "unknown",
  });
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  useEffect(() => {
    if (prefs) {
      setWakeWord(prefs.wakeWord);
      setSpeechRate(Number(prefs.speechRate));
      setLanguage(prefs.language);
      setHighContrast(prefs.highContrast);
      setHaptics(prefs.haptics);
      setMode(prefs.mode);
    }
  }, [prefs]);

  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions) {
      setPermissions({
        microphone: "unknown",
        camera: "unknown",
        location: "unknown",
      });
      return;
    }
    setPermissionsLoading(true);
    try {
      const [micResult, camResult, locResult] = await Promise.all([
        navigator.permissions
          .query({ name: "microphone" as PermissionName })
          .catch(() => ({ state: "unknown" as PermissionStatus })),
        navigator.permissions
          .query({ name: "camera" as PermissionName })
          .catch(() => ({ state: "unknown" as PermissionStatus })),
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .catch(() => ({ state: "unknown" as PermissionStatus })),
      ]);
      setPermissions({
        microphone: (micResult.state as PermissionStatus) || "unknown",
        camera: (camResult.state as PermissionStatus) || "unknown",
        location: (locResult.state as PermissionStatus) || "unknown",
      });
    } catch {
      setPermissions({
        microphone: "unknown",
        camera: "unknown",
        location: "unknown",
      });
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const handleSave = () => {
    savePrefs.mutate(
      {
        wakeWord,
        speechRate: BigInt(speechRate),
        language,
        highContrast,
        haptics,
        mode,
      },
      {
        onSuccess: () => toast.success("Settings saved!"),
        onError: () => toast.error("Failed to save settings"),
      },
    );
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-64"
        data-ocid="settings.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 min-h-[44px]"
        aria-label="Back to dashboard"
        data-ocid="settings.link"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl text-foreground">
          Settings
        </h1>
        <Button
          onClick={handleSave}
          disabled={savePrefs.isPending}
          className="flex items-center gap-2 font-semibold"
          style={{
            backgroundColor: "oklch(0.83 0.11 195)",
            color: "oklch(0.08 0.002 286)",
          }}
          aria-label="Save settings"
          data-ocid="settings.save_button"
        >
          {savePrefs.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" aria-hidden />
          )}
          Save
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Device Permissions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="permissions-heading"
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              id="permissions-heading"
              className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden /> Device Permissions
            </h2>
            <button
              type="button"
              onClick={checkPermissions}
              disabled={permissionsLoading}
              className="text-xs px-3 py-1 rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: "oklch(0.15 0.007 270)",
                color: "oklch(0.76 0.009 264)",
                border: "1px solid oklch(0.92 0.005 260 / 20%)",
              }}
              aria-label="Refresh permission status"
              data-ocid="settings.button"
            >
              {permissionsLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden />
              ) : (
                "Refresh"
              )}
            </button>
          </div>

          <ul className="flex flex-col gap-4" aria-label="Permission statuses">
            {(
              [
                {
                  key: "microphone" as const,
                  label: "Microphone",
                  description: "Required for voice commands",
                  icon: Mic,
                },
                {
                  key: "camera" as const,
                  label: "Camera",
                  description: "Required for GravityMode obstacle detection",
                  icon: Camera,
                },
                {
                  key: "location" as const,
                  label: "Location",
                  description: "Required for EarthMode GPS navigation",
                  icon: MapPin,
                },
              ] as const
            ).map(({ key, label, description, icon: Icon }) => {
              const status = permissions[key];
              return (
                <li
                  key={key}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.83 0.11 195 / 15%)" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.83 0.11 195)" }}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                  <PermissionBadge status={status} />
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-muted-foreground mt-4">
            Permissions are requested when you activate a feature. Grant access
            via your browser's address bar if denied.
          </p>
        </motion.section>

        {/* Voice Settings */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="voice-settings-heading"
        >
          <h2
            id="voice-settings-heading"
            className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2"
          >
            <Mic className="w-4 h-4" aria-hidden /> Voice Settings
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <Label
                htmlFor="wake-word"
                className="text-sm font-semibold text-foreground mb-1.5 block"
              >
                Wake Word
              </Label>
              <Input
                id="wake-word"
                value={wakeWord}
                onChange={(e) => setWakeWord(e.target.value)}
                placeholder="Hey Asteroid"
                className="bg-muted text-foreground placeholder:text-muted-foreground"
                aria-label="Wake word"
                data-ocid="settings.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The phrase that activates Asteroid hands-free
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Volume2 className="w-4 h-4" aria-hidden /> Speech Rate
                </Label>
                <span
                  className="text-sm font-mono"
                  style={{ color: "oklch(0.83 0.11 195)" }}
                >
                  {speechRate}/10
                </span>
              </div>
              <Slider
                value={[speechRate]}
                onValueChange={([val]) => setSpeechRate(val)}
                min={1}
                max={10}
                step={1}
                aria-label="Speech rate"
                data-ocid="settings.toggle"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div>
              <Label
                htmlFor="language-select"
                className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" aria-hidden /> Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  id="language-select"
                  className="bg-muted text-foreground"
                  aria-label="Select language"
                  data-ocid="settings.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.section>

        {/* Accessibility Settings */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="accessibility-heading"
        >
          <h2
            id="accessibility-heading"
            className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2"
          >
            <Contrast className="w-4 h-4" aria-hidden /> Accessibility
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  High Contrast Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Increases visual contrast for low-vision users
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
                data-ocid="settings.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Haptic Feedback
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vibration alerts for obstacles and turns
                  </p>
                </div>
              </div>
              <Switch
                checked={haptics}
                onCheckedChange={setHaptics}
                aria-label="Toggle haptic feedback"
                data-ocid="settings.switch"
              />
            </div>
          </div>
        </motion.section>

        {/* Mode Settings */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="mode-heading"
        >
          <h2
            id="mode-heading"
            className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" aria-hidden /> Default Mode
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {["Standard", "GravityMode", "EarthMode"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="py-3 px-4 rounded-lg text-sm font-semibold transition-all"
                style={
                  mode === m
                    ? {
                        backgroundColor: "oklch(0.83 0.11 195)",
                        color: "oklch(0.08 0.002 286)",
                      }
                    : {
                        backgroundColor: "oklch(0.15 0.007 270)",
                        color: "oklch(0.76 0.009 264)",
                        border: "1px solid oklch(0.92 0.005 260 / 15%)",
                      }
                }
                aria-label={`Set default mode to ${m}`}
                aria-pressed={mode === m}
                data-ocid="settings.toggle"
              >
                {m}
              </button>
            ))}
          </div>
        </motion.section>
      </div>

      {savePrefs.isSuccess && (
        <div
          className="mt-4 text-center text-sm"
          style={{ color: "oklch(0.78 0.16 155)" }}
          data-ocid="settings.success_state"
        >
          ✓ Settings saved successfully
        </div>
      )}
    </div>
  );
}

function PermissionBadge({ status }: { status: PermissionStatus }) {
  if (status === "granted") {
    return (
      <span
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: "oklch(0.78 0.16 155 / 20%)",
          color: "oklch(0.78 0.16 155)",
          border: "1px solid oklch(0.78 0.16 155 / 40%)",
        }}
        aria-label="Permission granted"
      >
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
        Granted
      </span>
    );
  }
  if (status === "denied") {
    return (
      <span
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: "oklch(0.62 0.22 25 / 20%)",
          color: "oklch(0.85 0.12 25)",
          border: "1px solid oklch(0.62 0.22 25 / 40%)",
        }}
        aria-label="Permission denied"
      >
        <XCircle className="w-3.5 h-3.5" aria-hidden />
        Denied
      </span>
    );
  }
  // prompt or unknown
  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: "oklch(0.87 0.16 84 / 15%)",
        color: "oklch(0.87 0.16 84)",
        border: "1px solid oklch(0.87 0.16 84 / 40%)",
      }}
      aria-label={
        status === "prompt"
          ? "Permission not yet requested"
          : "Permission status unknown"
      }
    >
      <HelpCircle className="w-3.5 h-3.5" aria-hidden />
      {status === "prompt" ? "Not asked" : "Unknown"}
    </span>
  );
}
