import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Home,
  MapPin,
  MessageSquare,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const NAV_ITEMS: { id: AppPage; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "gravity", label: "GravityMode", icon: Zap },
  { id: "earth", label: "EarthMode", icon: MapPin },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <div className="flex min-h-screen">
      {/* ── Left Sidebar (desktop) ───────────────────────────── */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-40 flex-col"
        style={{
          width: "260px",
          backgroundColor: "oklch(0.075 0.003 260)",
          borderRight: "1px solid oklch(0.90 0 0 / 7%)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 group"
            aria-label="Go to dashboard"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/asteroid-logo-transparent.dim_512x512.png"
              alt="Asteroid"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-cyan transition-colors">
              Asteroid
            </span>
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "oklch(0.90 0 0 / 7%)",
            margin: "0 20px 12px",
          }}
        />

        {/* Nav items */}
        <nav
          className="flex-1 px-3 flex flex-col gap-0.5"
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
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left ${
                  isActive
                    ? "nav-active"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-cyan"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    aria-hidden
                  />
                )}
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    color: isActive ? "oklch(0.82 0.10 195)" : undefined,
                  }}
                  aria-hidden
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: user + credits */}
        <div className="px-4 pb-5 flex flex-col gap-3">
          <div
            style={{ height: "1px", backgroundColor: "oklch(0.90 0 0 / 7%)" }}
          />

          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "oklch(0.12 0.004 260)",
                  border: "1px solid oklch(0.90 0 0 / 10%)",
                }}
              >
                <User className="w-4 h-4 text-muted-foreground" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {identity.getPrincipal().toString().slice(0, 14)}…
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
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              data-ocid="nav.button"
              aria-label="Login with Internet Identity"
              className="w-full bg-cyan text-background font-semibold rounded-lg h-9 text-sm hover:opacity-90 transition-opacity"
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? "Connecting…" : "Sign In"}
            </Button>
          )}

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            © {new Date().getFullYear()} · 
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1 md:ml-[260px] pb-16 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* ── Bottom tab bar (mobile only) ─────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around px-2 py-2"
        style={{
          backgroundColor: "oklch(0.075 0.003 260 / 95%)",
          borderTop: "1px solid oklch(0.90 0 0 / 10%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              data-ocid="nav.link"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all min-w-[40px]"
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: isActive
                    ? "oklch(0.82 0.10 195)"
                    : "oklch(0.55 0.006 260)",
                }}
                aria-hidden
              />
              <span
                className="text-[9px] font-medium"
                style={{
                  color: isActive
                    ? "oklch(0.82 0.10 195)"
                    : "oklch(0.55 0.006 260)",
                }}
              >
                {label === "GravityMode"
                  ? "Gravity"
                  : label === "EarthMode"
                    ? "Earth"
                    : label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
