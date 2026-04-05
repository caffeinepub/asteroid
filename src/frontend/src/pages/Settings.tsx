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
  Bot,
  Camera,
  CheckCircle2,
  Contrast,
  Globe,
  HelpCircle,
  Key,
  Loader2,
  MapPin,
  Mic,
  Moon,
  Moon as MoonIcon,
  Save,
  ShieldCheck,
  Sun,
  Vibrate,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { useTheme } from "../contexts/ThemeContext";
import { useAI } from "../hooks/useAI";
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
  const { theme, setTheme } = useTheme();
  const savePrefs = useSavePreferences();
  const { checkAIConfigured } = useAI();

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
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiChecking, setAiChecking] = useState(true);

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

  useEffect(() => {
    let cancelled = false;
    setAiChecking(true);
    checkAIConfigured().then((configured) => {
      if (!cancelled) {
        setAiConfigured(configured);
        setAiChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [checkAIConfigured]);

  const checkPermissions = useCallback(async () => {
    setPermissionsLoading(true);

    const checkMediaPermission = async (
      type: "microphone" | "camera",
    ): Promise<PermissionStatus> => {
      // First try the Permissions API (works in Chrome desktop reliably)
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({
            name: type as PermissionName,
          });
          // Only trust "granted" and "denied" from this API if not on a platform
          // known to lie. "prompt" is safe to return.
          if (result.state === "granted" || result.state === "denied") {
            return result.state as PermissionStatus;
          }
          // If "prompt", fall through to actually test
        } catch {
          // Permissions API doesn't support this query — fall through
        }
      }

      // Fall back: actually probe getUserMedia briefly
      if (!navigator.mediaDevices?.getUserMedia) {
        return "unknown";
      }
      try {
        const constraints =
          type === "camera" ? { video: true } : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Immediately stop all tracks — we only needed to check permission
        for (const track of stream.getTracks()) track.stop();
        return "granted";
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            return "denied";
          }
        }
        // NotFoundError, NotReadableError, etc. — device issue, not a permission issue
        return "unknown";
      }
    };

    const checkLocationPermission = async (): Promise<PermissionStatus> => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });
          return result.state as PermissionStatus;
        } catch {
          // ignore
        }
      }
      if (!navigator.geolocation) return "unknown";
      return "prompt"; // Can't tell without asking
    };

    try {
      const [micStatus, camStatus, locStatus] = await Promise.all([
        checkMediaPermission("microphone"),
        checkMediaPermission("camera"),
        checkLocationPermission(),
      ]);
      setPermissions({
        microphone: micStatus,
        camera: camStatus,
        location: locStatus,
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
        {/* Appearance */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="appearance-heading"
        >
          <h2
            id="appearance-heading"
            className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2"
          >
            <Sun className="w-4 h-4" aria-hidden /> Appearance
          </h2>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground mb-1">Color Mode</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                aria-label="Switch to dark mode"
                data-ocid="settings.toggle"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all"
                style={
                  theme === "dark"
                    ? {
                        backgroundColor: "oklch(0.78 0.18 210)",
                        color: "oklch(0.04 0.005 240)",
                      }
                    : {
                        backgroundColor: "oklch(0.15 0.007 270)",
                        color: "oklch(0.76 0.009 264)",
                        border: "1px solid oklch(0.92 0.005 260 / 15%)",
                      }
                }
              >
                <Moon className="w-4 h-4" aria-hidden />
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                aria-label="Switch to light mode"
                data-ocid="settings.toggle"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all"
                style={
                  theme === "light"
                    ? {
                        backgroundColor: "oklch(0.52 0.18 210)",
                        color: "oklch(0.97 0.003 225)",
                      }
                    : {
                        backgroundColor: "oklch(0.15 0.007 270)",
                        color: "oklch(0.76 0.009 264)",
                        border: "1px solid oklch(0.92 0.005 260 / 15%)",
                      }
                }
              >
                <Sun className="w-4 h-4" aria-hidden />
                Light
              </button>
            </div>
          </div>
        </motion.section>

        {/* AI Assistant */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-xl p-6"
          style={{
            backgroundColor: "oklch(0.11 0.005 260)",
            border: "1px solid oklch(0.92 0.005 260 / 15%)",
          }}
          aria-labelledby="ai-heading"
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              id="ai-heading"
              className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2"
            >
              <Bot className="w-4 h-4" aria-hidden /> AI Assistant
            </h2>
            {aiChecking ? (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.15 0.005 264)",
                  color: "oklch(0.55 0.009 264)",
                  border: "1px solid oklch(0.92 0.005 260 / 20%)",
                }}
                data-ocid="settings.loading_state"
              >
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden />
                Checking...
              </span>
            ) : aiConfigured ? (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.78 0.16 155 / 20%)",
                  color: "oklch(0.78 0.16 155)",
                  border: "1px solid oklch(0.78 0.16 155 / 40%)",
                }}
                data-ocid="settings.success_state"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "oklch(0.78 0.16 155)" }}
                />
                Connected
              </span>
            ) : (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.87 0.16 84 / 15%)",
                  color: "oklch(0.87 0.16 84)",
                  border: "1px solid oklch(0.87 0.16 84 / 40%)",
                }}
                data-ocid="settings.error_state"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "oklch(0.87 0.16 84)" }}
                />
                Not configured
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            {aiConfigured
              ? "AI assistant is active. GPT-4o mini is ready to answer your questions."
              : "Contact the app administrator to set up the AI key."}
          </p>

          {/* Setup API Key button */}
          <Button
            variant="outline"
            onClick={() => onNavigate("admin")}
            className="flex items-center gap-2 text-sm font-semibold min-h-[44px]"
            style={{
              backgroundColor: "oklch(0.15 0.007 270)",
              color: "oklch(0.83 0.11 195)",
              border: "1px solid oklch(0.83 0.11 195 / 40%)",
            }}
            aria-label="Setup API key for AI assistant"
            data-ocid="settings.open_modal_button"
          >
            <Key className="w-4 h-4" aria-hidden />
            Setup API Key
          </Button>
        </motion.section>

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
