import { useEffect, useRef, useState } from "react";

interface WelcomeSplashProps {
  onComplete: () => void;
}

export default function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 30);
    const exitTimer = setTimeout(() => setExiting(true), 2800);
    const doneTimer = setTimeout(() => onCompleteRef.current(), 3500);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const marqueeText =
    "QUARQ/AI  \u00b7  THE EVERYTHING ASSISTANT  \u00b7  QUARQ/AI  \u00b7  THE EVERYTHING ASSISTANT  \u00b7  QUARQ/AI  \u00b7  THE EVERYTHING ASSISTANT  \u00b7  ";

  return (
    <div
      data-ocid="welcome.page"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        opacity: exiting ? 0 : visible ? 1 : 0,
        transform: exiting
          ? "translateY(-8px)"
          : visible
            ? "translateY(0)"
            : "translateY(20px)",
        transition: exiting
          ? "opacity 0.7s ease-in, transform 0.7s ease-in"
          : "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {/* ── Space background image ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('/assets/generated/welcome-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />
      {/* Dark overlay to keep text readable */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,16,0.55) 0%, rgba(5,5,16,0.35) 40%, rgba(5,5,16,0.55) 100%)",
          zIndex: 1,
        }}
      />
      {/* Subtle noise texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Header bar */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(5,5,16,0.3)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          QUARQ/AI
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          WELCOME
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          V.33
        </span>
      </header>

      {/* ── Center hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* Q logo mark — large decorative, slightly off-center */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.14,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 36 36"
            width="140"
            height="140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Quarq/AI logo mark"
          >
            <title>Quarq/AI logo mark</title>
            <circle
              cx="16"
              cy="16"
              r="10"
              stroke="oklch(0.78 0.18 210)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="23"
              y1="23"
              x2="30"
              y2="31"
              stroke="oklch(0.78 0.18 210)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Glow halo behind wordmark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "500px",
            height: "300px",
            background:
              "radial-gradient(ellipse at center, rgba(0,212,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Giant wordmark */}
        <div
          style={{
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            WELCOME TO
          </p>

          {/* QUARQ — giant display wordmark */}
          <h1
            style={{
              fontFamily: "BricolageGrotesque, 'Helvetica Neue', sans-serif",
              fontSize: "clamp(64px, 18vw, 220px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#ffffff",
              margin: 0,
              textAlign: "center",
              textShadow:
                "0 0 60px rgba(0,212,255,0.35), 0 0 120px rgba(0,212,255,0.15)",
            }}
          >
            QUARQ
          </h1>

          {/* /AI secondary line */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "clamp(11px, 1.4vw, 16px)",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            / AI \u2014 THE EVERYTHING ASSISTANT
          </p>
        </div>

        {/* Cyan accent line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 40%, rgba(0,212,255,0.7) 50%, rgba(0,212,255,0.4) 60%, transparent 100%)",
          }}
        />
      </main>

      {/* ── Scrolling marquee */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 0",
          overflow: "hidden",
          flexShrink: 0,
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(5,5,16,0.3)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: "inline-flex",
            animation: "marquee-scroll 22s linear infinite",
            willChange: "transform",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            {marqueeText}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            {marqueeText}
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
