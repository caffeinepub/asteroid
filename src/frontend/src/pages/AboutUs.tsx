import { motion } from "motion/react";
import type { AppPage } from "../App";
import AsteroidLogo from "../components/AsteroidLogo";

interface AboutUsProps {
  onNavigate: (page: AppPage) => void;
}

const VALUES = [
  {
    emoji: "♿",
    title: "Accessibility First",
    description:
      "Every feature is built with universal design at its core. No compromises, no afterthoughts — accessibility is our foundation, not a feature.",
    color: "oklch(0.78 0.18 210)",
    bgColor: "oklch(0.78 0.18 210 / 6%)",
    borderColor: "oklch(0.78 0.18 210 / 25%)",
    glowColor: "oklch(0.78 0.18 210 / 15%)",
  },
  {
    emoji: "💪",
    title: "Empowerment",
    description:
      "We build technology that fosters independence, not dependency. Quarq/AI gives users the tools to live life on their own terms.",
    color: "oklch(0.78 0.16 155)",
    bgColor: "oklch(0.78 0.16 155 / 6%)",
    borderColor: "oklch(0.78 0.16 155 / 25%)",
    glowColor: "oklch(0.78 0.16 155 / 15%)",
  },
  {
    emoji: "🚀",
    title: "Innovation",
    description:
      "We push the limits of AI, computer vision, and navigation technology to create real-world impact for those who need it most.",
    color: "oklch(0.72 0.22 35)",
    bgColor: "oklch(0.72 0.22 35 / 6%)",
    borderColor: "oklch(0.72 0.22 35 / 25%)",
    glowColor: "oklch(0.72 0.22 35 / 15%)",
  },
  {
    emoji: "🤝",
    title: "Inclusion",
    description:
      "We build with and for the community we serve. Every voice matters, and every perspective shapes the tools we create together.",
    color: "oklch(0.52 0.22 261)",
    bgColor: "oklch(0.52 0.22 261 / 6%)",
    borderColor: "oklch(0.52 0.22 261 / 25%)",
    glowColor: "oklch(0.52 0.22 261 / 15%)",
  },
];

const TEAM = [
  {
    initial: "S",
    name: "Samyo Debnath",
    role: "CEO & Founder",
    bio: "Driven by a vision to make AI-powered assistance universally accessible, Samyo founded Quarq/AI to bridge the gap between emerging technology and those who need it most. His unwavering belief that great technology should empower every person — regardless of physical ability — shapes every decision at Quarq/AI.",
    accentColor: "oklch(0.78 0.18 210)",
    roleColor: "oklch(0.78 0.18 210 / 12%)",
    roleFontColor: "oklch(0.78 0.18 210)",
  },
  {
    initial: "R",
    name: "Ritam Paul",
    role: "CFO",
    bio: "Ritam brings sharp financial acumen and strategic insight to Quarq/AI, ensuring the company achieves sustainable growth while keeping the mission of accessibility at the heart of every decision. He believes that purpose-driven companies are the most resilient, and he works tirelessly to ensure Quarq/AI thrives for the long haul.",
    accentColor: "oklch(0.78 0.16 155)",
    roleColor: "oklch(0.78 0.16 155 / 12%)",
    roleFontColor: "oklch(0.78 0.16 155)",
  },
];

export default function AboutUsPage({ onNavigate: _onNavigate }: AboutUsProps) {
  return (
    <div
      className="min-h-screen px-5 sm:px-8 pt-8 pb-20"
      aria-label="About Us page"
      data-ocid="about.page"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
          aria-label="Hero section"
        >
          <div className="flex justify-center mb-6">
            <AsteroidLogo size={72} />
          </div>
          <div className="mb-4">
            <span className="text-hud" style={{ opacity: 0.6 }}>
              {"MISSION BRIEF // QUARQ/AI"}
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-3">
            About{" "}
            <span
              style={{
                color: "oklch(0.78 0.18 210)",
                textShadow: "0 0 20px oklch(0.78 0.18 210 / 30%)",
              }}
            >
              Quarq/AI
            </span>
          </h1>
          <p
            className="text-sm font-mono uppercase tracking-widest mb-5"
            style={{ color: "oklch(0.55 0.008 220)" }}
          >
            The Everything Assistant
          </p>
          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "oklch(0.68 0.006 240)" }}
          >
            Quarq/AI is an accessibility-first AI assistant designed to empower
            blind and disabled users in daily life. We combine conversational
            AI, real-time computer vision, and GPS navigation — all operable
            hands-free, with your voice.
          </p>
        </motion.header>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 p-7 hud-border clip-corner"
          style={{
            backgroundColor: "oklch(0.075 0.006 235)",
          }}
          aria-labelledby="mission-heading"
          data-ocid="about.section"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-hud"
              style={{ color: "oklch(0.78 0.18 210)", opacity: 0.7 }}
            >
              {"01 //"}
            </span>
            <h2
              id="mission-heading"
              className="font-display font-bold text-2xl text-foreground tracking-tight"
            >
              Our Mission
            </h2>
          </div>
          <p
            className="text-base leading-relaxed"
            style={{ color: "oklch(0.72 0.006 240)" }}
          >
            To democratize access to intelligent assistance for everyone —
            regardless of physical ability. We believe cutting-edge AI tools
            should be universally available: hands-free, voice-first, and
            completely accessible. No barriers. No exceptions.
          </p>
        </motion.section>

        {/* Vision */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mb-10 p-7 hud-border clip-corner"
          style={{
            backgroundColor: "oklch(0.075 0.006 235)",
          }}
          aria-labelledby="vision-heading"
          data-ocid="about.section"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-hud"
              style={{ color: "oklch(0.78 0.18 210)", opacity: 0.7 }}
            >
              {"02 //"}
            </span>
            <h2
              id="vision-heading"
              className="font-display font-bold text-2xl text-foreground tracking-tight"
            >
              Our Vision
            </h2>
          </div>
          <p
            className="text-base leading-relaxed"
            style={{ color: "oklch(0.72 0.006 240)" }}
          >
            A world where no one is left behind by technology. A world where
            blind and disabled individuals navigate daily life with the same
            confidence, independence, and capability as anyone else. We envision
            a future where the gap between emerging technology and those who
            need it most is permanently closed.
          </p>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="mb-12"
          aria-labelledby="values-heading"
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-hud"
              style={{ color: "oklch(0.78 0.18 210)", opacity: 0.7 }}
            >
              {"03 //"}
            </span>
            <h2
              id="values-heading"
              className="font-display font-bold text-2xl text-foreground tracking-tight"
            >
              Our Values
            </h2>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="about.panel"
          >
            {VALUES.map(
              (
                {
                  emoji,
                  title,
                  description,
                  color,
                  bgColor,
                  borderColor,
                  glowColor,
                },
                i,
              ) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  className="p-5 clip-corner"
                  style={{
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 0 20px ${glowColor}`,
                  }}
                  data-ocid="about.card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl" aria-hidden>
                      {emoji}
                    </span>
                    <h3
                      className="font-mono font-semibold text-sm uppercase tracking-wider"
                      style={{ color }}
                    >
                      {title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.70 0.005 240)" }}
                  >
                    {description}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          aria-labelledby="team-heading"
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-hud"
              style={{ color: "oklch(0.78 0.18 210)", opacity: 0.7 }}
            >
              {"04 //"}
            </span>
            <h2
              id="team-heading"
              className="font-display font-bold text-2xl text-foreground tracking-tight"
            >
              Meet the Team
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {TEAM.map(
              (
                {
                  initial,
                  name,
                  role,
                  bio,
                  accentColor,
                  roleColor,
                  roleFontColor,
                },
                i,
              ) => (
                <motion.article
                  key={name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.38 + i * 0.1 }}
                  className="p-6 clip-corner"
                  style={{
                    backgroundColor: "oklch(0.075 0.006 235)",
                    border: `1px solid ${accentColor}20`,
                    boxShadow: `0 0 20px ${accentColor}08`,
                  }}
                  aria-label={`${name}, ${role}`}
                  data-ocid="about.card"
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar - sharp square */}
                    <div
                      className="w-16 h-16 flex items-center justify-center flex-shrink-0 font-display font-bold text-2xl"
                      style={{
                        backgroundColor: accentColor,
                        color: "oklch(0.04 0.005 240)",
                        borderRadius: "0.2rem",
                        boxShadow: `0 0 16px ${accentColor}40`,
                      }}
                      aria-hidden
                    >
                      {initial}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {name}
                        </h3>
                        <span
                          className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5"
                          style={{
                            backgroundColor: roleColor,
                            color: roleFontColor,
                            borderRadius: "0.1rem",
                            border: `1px solid ${roleFontColor}30`,
                          }}
                        >
                          {role}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(0.68 0.006 240)" }}
                      >
                        {bio}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </motion.section>

        {/* Footer attribution */}
        <footer
          className="mt-16 pt-6 text-center"
          style={{
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "oklch(0.78 0.18 210 / 15%)",
          }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: "oklch(0.38 0.005 240)" }}
          >
            &copy; {new Date().getFullYear()} &middot; Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
              style={{ color: "oklch(0.48 0.005 240)" }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
