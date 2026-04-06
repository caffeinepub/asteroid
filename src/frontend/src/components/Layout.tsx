import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  HelpCircle,
  Home,
  Info,
  MapPin,
  MessageSquare,
  Moon,
  Settings,
  Sparkles,
  Star,
  Sun,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { AppPage } from "../App";
import { useTheme } from "../contexts/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AsteroidLogo from "./AsteroidLogo";

interface LayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const NAV_ITEMS: {
  id: AppPage;
  label: string;
  mobileLabel?: string;
  icon: typeof Home;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "gravity", label: "GluonMode", mobileLabel: "Gluon", icon: Zap },
  { id: "earth", label: "NucleusMode", mobileLabel: "Nucleus", icon: MapPin },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "features", label: "Features", icon: Star },
  { id: "help", label: "Help", icon: HelpCircle },
  {
    id: "changelog",
    label: "What's New",
    mobileLabel: "New",
    icon: Sparkles,
  },
  { id: "about", label: "About Us", mobileLabel: "About", icon: Info },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar (desktop) */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-40 flex-col"
        style={{
          width: "260px",
          backgroundColor: "oklch(var(--sidebar))",
          borderRight: "1px solid oklch(var(--sidebar-border))",
          boxShadow: isDark
            ? "4px 0 24px oklch(0.78 0.18 210 / 6%)"
            : "4px 0 24px oklch(0.52 0.18 210 / 8%)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center px-5 py-6">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-3 group"
            aria-label="Go to dashboard"
            data-ocid="nav.link"
          >
            <AsteroidLogo size={36} />
            <span
              className="font-display font-bold text-base tracking-wider"
              style={{ color: "oklch(var(--sidebar-foreground))" }}
            >
              QUARQ/AI
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: isDark
              ? "linear-gradient(90deg, transparent, oklch(0.78 0.18 210 / 30%), transparent)"
              : "linear-gradient(90deg, transparent, oklch(0.52 0.18 210 / 30%), transparent)",
            margin: "0 20px 12px",
          }}
        />

        {/* Nav items */}
        <nav
          className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto pb-2"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = currentPage === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                data-ocid="nav.link"
                aria-label={`Navigate to ${label}`}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 w-full text-left ${
                  isActive
                    ? "nav-active"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                style={{
                  borderRadius: "0.2rem",
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 12px oklch(0.78 0.18 210 / 25%)"
                      : "0 0 12px oklch(0.52 0.18 210 / 20%)"
                    : undefined,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5"
                    style={{
                      background: isDark
                        ? "linear-gradient(180deg, oklch(0.78 0.18 210 / 0%), oklch(0.78 0.18 210), oklch(0.78 0.18 210 / 0%))"
                        : "linear-gradient(180deg, oklch(0.52 0.18 210 / 0%), oklch(0.52 0.18 210), oklch(0.52 0.18 210 / 0%))",
                      boxShadow: isDark
                        ? "0 0 8px oklch(0.78 0.18 210 / 60%)"
                        : "0 0 8px oklch(0.52 0.18 210 / 50%)",
                      borderRadius: "0",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                    aria-hidden
                  />
                )}
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    color: isActive
                      ? isDark
                        ? "oklch(0.78 0.18 210)"
                        : "oklch(0.52 0.18 210)"
                      : undefined,
                  }}
                  aria-hidden
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-5 flex flex-col gap-3">
          <div
            style={{
              height: "1px",
              background: isDark
                ? "linear-gradient(90deg, transparent, oklch(0.78 0.18 210 / 25%), transparent)"
                : "linear-gradient(90deg, transparent, oklch(0.52 0.18 210 / 25%), transparent)",
            }}
          />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            data-ocid="nav.button"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-secondary w-full"
            style={{ borderRadius: "0.2rem" }}
          >
            {isDark ? (
              <Sun className="w-4 h-4" aria-hidden />
            ) : (
              <Moon className="w-4 h-4" aria-hidden />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isDark
                    ? "oklch(0.10 0.006 235)"
                    : "oklch(0.88 0.005 225)",
                  border: isDark
                    ? "1px solid oklch(0.78 0.18 210 / 20%)"
                    : "1px solid oklch(0.52 0.18 210 / 20%)",
                  borderRadius: "0.2rem",
                }}
              >
                <User className="w-4 h-4 text-muted-foreground" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate text-muted-foreground">
                  {identity.getPrincipal().toString().slice(0, 14)}&hellip;
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                data-ocid="nav.button"
                aria-label="Logout"
                className="text-xs text-muted-foreground hover:text-foreground px-2 h-7"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              data-ocid="nav.button"
              aria-label="Login with Internet Identity"
              className="w-full text-sm font-semibold h-9 transition-all"
              style={{
                backgroundColor: isDark
                  ? "oklch(0.78 0.18 210)"
                  : "oklch(0.52 0.18 210)",
                color: isDark
                  ? "oklch(0.04 0.005 240)"
                  : "oklch(0.97 0.003 225)",
                borderRadius: "0.2rem",
                boxShadow: isDark
                  ? "0 0 16px oklch(0.78 0.18 210 / 30%)"
                  : "0 0 16px oklch(0.52 0.18 210 / 25%)",
              }}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? "Connecting..." : "Sign in"}
            </Button>
          )}
          <p className="text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} &middot;{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[260px] pb-16 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom tab bar (mobile only) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center px-1 py-2 overflow-x-auto"
        style={{
          backgroundColor: isDark
            ? "oklch(0.055 0.006 235 / 95%)"
            : "oklch(0.91 0.005 225 / 95%)",
          borderTop: isDark
            ? "1px solid oklch(0.78 0.18 210 / 20%)"
            : "1px solid oklch(0.52 0.18 210 / 20%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 -4px 20px oklch(0.78 0.18 210 / 6%)"
            : "0 -4px 20px oklch(0.52 0.18 210 / 8%)",
        }}
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ id, label, mobileLabel, icon: Icon }) => {
          const isActive = currentPage === id;
          const displayLabel = mobileLabel ?? label;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              data-ocid="nav.link"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 px-2 py-1 transition-all flex-shrink-0 min-w-[44px]"
              style={{ borderRadius: "0.2rem" }}
            >
              <Icon
                className="w-4 h-4"
                style={{
                  color: isActive
                    ? isDark
                      ? "oklch(0.78 0.18 210)"
                      : "oklch(0.52 0.18 210)"
                    : isDark
                      ? "oklch(0.45 0.006 240)"
                      : "oklch(0.50 0.008 230)",
                  filter: isActive
                    ? isDark
                      ? "drop-shadow(0 0 4px oklch(0.78 0.18 210 / 60%))"
                      : "drop-shadow(0 0 4px oklch(0.52 0.18 210 / 50%))"
                    : undefined,
                }}
                aria-hidden
              />
              <span
                className="text-[9px]"
                style={{
                  color: isActive
                    ? isDark
                      ? "oklch(0.78 0.18 210)"
                      : "oklch(0.52 0.18 210)"
                    : isDark
                      ? "oklch(0.45 0.006 240)"
                      : "oklch(0.50 0.008 230)",
                }}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
        {/* Theme toggle in mobile nav */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          data-ocid="nav.button"
          className="flex flex-col items-center gap-0.5 px-2 py-1 transition-all flex-shrink-0 min-w-[44px]"
          style={{ borderRadius: "0.2rem" }}
        >
          {isDark ? (
            <Sun
              className="w-4 h-4"
              style={{ color: "oklch(0.45 0.006 240)" }}
              aria-hidden
            />
          ) : (
            <Moon
              className="w-4 h-4"
              style={{ color: "oklch(0.50 0.008 230)" }}
              aria-hidden
            />
          )}
          <span
            className="text-[9px]"
            style={{
              color: isDark ? "oklch(0.45 0.006 240)" : "oklch(0.50 0.008 230)",
            }}
          >
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </nav>
    </div>
  );
}
