export default function AsteroidLogo({ size = 36 }: { size?: number }) {
  const scale = size / 36;
  return (
    <svg
      viewBox="0 0 36 42"
      width={36 * scale}
      height={42 * scale}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Asteroid logo"
    >
      <title>Asteroid</title>
      {/* Left stroke of A */}
      <path
        d="M4 40 L18 4 L32 40"
        stroke="oklch(0.78 0.18 210)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot at crossbar position — replaces horizontal line */}
      <circle cx="18" cy="26" r="2.5" fill="oklch(0.78 0.18 210)" />
    </svg>
  );
}
