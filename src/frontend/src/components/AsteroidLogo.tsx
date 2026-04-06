export default function AsteroidLogo({ size = 36 }: { size?: number }) {
  const scale = size / 36;
  return (
    <svg
      viewBox="0 0 36 36"
      width={36 * scale}
      height={36 * scale}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Quarq/AI logo"
    >
      <title>Quarq/AI</title>
      {/* Circle ring of Q */}
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke="oklch(0.78 0.18 210)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Diagonal tail of Q */}
      <line
        x1="23"
        y1="23"
        x2="30"
        y2="31"
        stroke="oklch(0.78 0.18 210)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
