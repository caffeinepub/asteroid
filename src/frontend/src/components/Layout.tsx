import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { ReactNode } from "react";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const uniqueNavLinks: { id: AppPage; label: string; key: string }[] = [
  { id: "dashboard", label: "Home", key: "home" },
  { id: "dashboard", label: "Dashboard", key: "dashboard" },
  { id: "gravity", label: "GravityMode", key: "gravity" },
  { id: "earth", label: "EarthMode", key: "earth" },
  { id: "settings", label: "Settings", key: "settings" },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: "oklch(0.09 0.003 260)",
          borderBottom: "1px solid oklch(0.92 0.005 260 / 15%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="font-display font-bold text-2xl tracking-tight text-cyan hover:opacity-80 active:opacity-60 transition-opacity duration-150"
              aria-label="Go to home"
              data-ocid="nav.link"
            >
              Asteroid
            </button>

            {/* Nav Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {uniqueNavLinks.map((link) => {
                const isCurrentActive =
                  link.key === currentPage ||
                  (link.key === "dashboard" && currentPage === "dashboard") ||
                  (link.key === "home" && currentPage === "dashboard");
                return (
                  <button
                    key={link.key}
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    data-ocid="nav.link"
                    aria-label={`Navigate to ${link.label}`}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 min-h-[44px] active:opacity-70 ${
                      isCurrentActive
                        ? "text-cyan"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {isCurrentActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {identity.getPrincipal().toString().slice(0, 8)}...
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clear}
                    data-ocid="nav.button"
                    aria-label="Logout"
                    className="border-border text-muted-foreground hover:text-foreground active:opacity-70 transition-all duration-150"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-ocid="nav.button"
                  aria-label="Login with Internet Identity"
                  className="bg-cyan text-background font-semibold px-5 rounded-full hover:opacity-90 active:scale-[0.97] transition-all duration-150"
                  disabled={loginStatus === "logging-in"}
                >
                  {loginStatus === "logging-in" ? "Connecting..." : "LOGIN"}
                </Button>
              )}
              <button
                type="button"
                className="w-9 h-9 rounded-full flex items-center justify-center active:opacity-60 transition-opacity duration-150"
                style={{
                  backgroundColor: "oklch(0.15 0.007 270)",
                  border: "1px solid oklch(0.92 0.005 260 / 20%)",
                }}
                aria-label="User profile"
                data-ocid="nav.button"
              >
                <User className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Mobile nav */}
              <nav className="md:hidden" aria-label="Mobile navigation">
                <select
                  className="bg-card text-foreground text-sm border border-border rounded px-2 py-1"
                  value={currentPage}
                  onChange={(e) => onNavigate(e.target.value as AppPage)}
                  aria-label="Navigate to page"
                  data-ocid="nav.select"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="gravity">GravityMode</option>
                  <option value="earth">EarthMode</option>
                  <option value="tasks">Tasks</option>
                  <option value="settings">Settings</option>
                </select>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="mt-auto"
        style={{
          backgroundColor: "oklch(0.09 0.003 260)",
          borderTop: "1px solid oklch(0.92 0.005 260 / 15%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button
                type="button"
                className="hover:text-foreground active:opacity-60 transition-all duration-150"
                aria-label="About Asteroid"
              >
                About
              </button>
              <button
                type="button"
                className="hover:text-foreground active:opacity-60 transition-all duration-150"
                aria-label="Privacy policy"
              >
                Privacy
              </button>
              <button
                type="button"
                className="hover:text-foreground active:opacity-60 transition-all duration-150"
                aria-label="Support"
              >
                Support
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Asteroid © {new Date().getFullYear()} &nbsp;·&nbsp;&nbsp;
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                Built with ♥ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
