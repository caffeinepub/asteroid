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
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Key,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { useActor } from "../hooks/useActor";

interface AdminSetupProps {
  onNavigate: (page: AppPage) => void;
}

const ADMIN_PIN = "asteroid123";

type AIProvider = "openai" | "gemini" | "groq" | "cohere";

interface ProviderInfo {
  label: string;
  hint: string;
  placeholder: string;
  url: string;
  urlLabel: string;
  free?: boolean;
}

const PROVIDERS: Record<AIProvider, ProviderInfo> = {
  openai: {
    label: "OpenAI",
    hint: "sk-...",
    placeholder: "sk-...",
    url: "https://platform.openai.com/api-keys",
    urlLabel: "platform.openai.com/api-keys",
  },
  gemini: {
    label: "Google Gemini",
    hint: "AIza...",
    placeholder: "AIza...",
    url: "https://aistudio.google.com",
    urlLabel: "aistudio.google.com",
    free: true,
  },
  groq: {
    label: "Groq",
    hint: "gsk_...",
    placeholder: "gsk_...",
    url: "https://console.groq.com",
    urlLabel: "console.groq.com",
    free: true,
  },
  cohere: {
    label: "Cohere",
    hint: "API key",
    placeholder: "Enter your Cohere API key",
    url: "https://dashboard.cohere.com",
    urlLabel: "dashboard.cohere.com",
    free: true,
  },
};

export default function AdminSetupPage({ onNavigate }: AdminSetupProps) {
  const { actor } = useActor();

  // Stage 1 state
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [stage, setStage] = useState<"pin" | "key">("pin");

  // Stage 2 state
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const providerInfo = PROVIDERS[selectedProvider];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setPinError("");
      setStage("key");
    } else {
      setPinError("Incorrect PIN");
    }
  };

  const handleKeySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setSaveError("Not connected to backend. Please wait and try again.");
      return;
    }
    if (apiKey.trim().length < 10) {
      setSaveError("Please enter a valid API key (at least 10 characters).");
      return;
    }
    setIsSaving(true);
    setSaveError("");
    try {
      await actor.setAIConfig(selectedProvider, apiKey.trim());
      setSaved(true);
      toast.success(`${providerInfo.label} key saved! AI is now active.`);
      setTimeout(() => onNavigate("settings"), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save key";
      setSaveError(msg);
      toast.error("Failed to save API key");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("settings")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 min-h-[44px]"
        aria-label="Back to settings"
        data-ocid="admin.link"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden />
        Back to Settings
      </button>

      {stage === "pin" ? (
        <motion.div
          key="pin-stage"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "oklch(0.83 0.11 195 / 20%)" }}
            >
              <ShieldCheck
                className="w-6 h-6"
                style={{ color: "oklch(0.83 0.11 195)" }}
                aria-hidden
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Admin Access
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your admin PIN to continue
              </p>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl p-6"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
          >
            <form onSubmit={handlePinSubmit} noValidate>
              <div className="mb-5">
                <Label
                  htmlFor="admin-pin"
                  className="text-sm font-semibold text-foreground mb-1.5 block"
                >
                  Admin PIN
                </Label>
                <Input
                  id="admin-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (pinError) setPinError("");
                  }}
                  placeholder="Enter PIN"
                  className="bg-muted text-foreground placeholder:text-muted-foreground min-h-[44px]"
                  aria-label="Admin PIN"
                  aria-describedby={pinError ? "pin-error" : undefined}
                  aria-invalid={!!pinError}
                  autoFocus
                  data-ocid="admin.input"
                />
                {pinError && (
                  <p
                    id="pin-error"
                    className="mt-2 text-sm font-medium"
                    style={{ color: "oklch(0.85 0.12 25)" }}
                    role="alert"
                    data-ocid="admin.error_state"
                  >
                    {pinError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full min-h-[44px] font-semibold"
                style={{
                  backgroundColor: "oklch(0.83 0.11 195)",
                  color: "oklch(0.08 0.002 286)",
                }}
                aria-label="Submit PIN"
                data-ocid="admin.submit_button"
              >
                <ShieldCheck className="w-4 h-4 mr-2" aria-hidden />
                Verify PIN
              </Button>
            </form>
          </motion.section>
        </motion.div>
      ) : (
        <motion.div
          key="key-stage"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "oklch(0.83 0.11 195 / 20%)" }}
            >
              <Key
                className="w-6 h-6"
                style={{ color: "oklch(0.83 0.11 195)" }}
                aria-hidden
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Configure AI Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose your AI provider and enter the API key
              </p>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl p-6"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 15%)",
            }}
          >
            <form onSubmit={handleKeySave} noValidate>
              {/* Provider selector */}
              <div className="mb-5">
                <Label
                  htmlFor="ai-provider"
                  className="text-sm font-semibold text-foreground mb-1.5 block"
                >
                  AI Provider
                </Label>
                <Select
                  value={selectedProvider}
                  onValueChange={(v) => {
                    setSelectedProvider(v as AIProvider);
                    setApiKey("");
                    setSaveError("");
                  }}
                  disabled={isSaving || saved}
                >
                  <SelectTrigger
                    id="ai-provider"
                    className="bg-muted text-foreground min-h-[44px]"
                    aria-label="Select AI provider"
                    data-ocid="admin.select"
                  >
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(PROVIDERS) as [AIProvider, ProviderInfo][]
                    ).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          {info.label}
                          {info.free && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: "oklch(0.78 0.16 155 / 20%)",
                                color: "oklch(0.78 0.16 155)",
                              }}
                            >
                              Free tier
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Provider help link */}
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  Get your key at{" "}
                  <a
                    href={providerInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 hover:underline"
                    style={{ color: "oklch(0.83 0.11 195)" }}
                  >
                    {providerInfo.urlLabel}
                    <ExternalLink className="w-3 h-3" aria-hidden />
                  </a>
                  {providerInfo.free && (
                    <span
                      className="ml-1 font-medium"
                      style={{ color: "oklch(0.78 0.16 155)" }}
                    >
                      — free tier available
                    </span>
                  )}
                </p>
              </div>

              {/* API Key input */}
              <div className="mb-5">
                <Label
                  htmlFor="api-key"
                  className="text-sm font-semibold text-foreground mb-1.5 block"
                >
                  {providerInfo.label} API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (saveError) setSaveError("");
                  }}
                  placeholder={providerInfo.placeholder}
                  className="bg-muted text-foreground placeholder:text-muted-foreground min-h-[44px] font-mono text-sm"
                  aria-label={`${providerInfo.label} API Key`}
                  aria-describedby={saveError ? "key-error" : "key-hint"}
                  aria-invalid={!!saveError}
                  disabled={isSaving || saved}
                  autoFocus
                  data-ocid="admin.input"
                />
                <p
                  id="key-hint"
                  className="mt-1.5 text-xs text-muted-foreground"
                >
                  Key format:{" "}
                  <code className="font-mono">{providerInfo.hint}</code>
                </p>
                {saveError && (
                  <p
                    id="key-error"
                    className="mt-2 text-sm font-medium"
                    style={{ color: "oklch(0.85 0.12 25)" }}
                    role="alert"
                    data-ocid="admin.error_state"
                  >
                    {saveError}
                  </p>
                )}
              </div>

              {saved ? (
                <output
                  className="flex items-center gap-2 justify-center py-3 px-4 rounded-lg text-sm font-semibold w-full"
                  style={{
                    backgroundColor: "oklch(0.78 0.16 155 / 15%)",
                    color: "oklch(0.78 0.16 155)",
                    border: "1px solid oklch(0.78 0.16 155 / 40%)",
                  }}
                  aria-live="polite"
                  data-ocid="admin.success_state"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden />✓ API key
                  saved! AI is now active.
                </output>
              ) : (
                <Button
                  type="submit"
                  className="w-full min-h-[44px] font-semibold"
                  style={{
                    backgroundColor: "oklch(0.83 0.11 195)",
                    color: "oklch(0.08 0.002 286)",
                  }}
                  disabled={isSaving || apiKey.trim().length < 10}
                  aria-label={`Save ${providerInfo.label} API Key`}
                  data-ocid="admin.submit_button"
                >
                  {isSaving ? (
                    <>
                      <Loader2
                        className="w-4 h-4 mr-2 animate-spin"
                        aria-hidden
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" aria-hidden />
                      Save Key
                    </>
                  )}
                </Button>
              )}
            </form>
          </motion.section>

          {isSaving && (
            <output
              className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              aria-live="polite"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Saving key to backend...
            </output>
          )}
        </motion.div>
      )}
    </div>
  );
}
