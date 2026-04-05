# Asteroid — Futuristic SpaceX-Style Visual Upgrade

## Current State
The app uses a dark minimalist theme inspired by ChatGPT's aesthetic — deep near-black backgrounds, cyan accent, Satoshi/BricolageGrotesque fonts, soft rounded corners, and subtle 7% opacity borders. The logo is a generic "A" lettermark. The overall feel is clean and modern but not distinctly futuristic or aerospace-branded.

## Requested Changes (Diff)

### Add
- New SpaceX-style logo image (`/assets/generated/asteroid-spacex-logo-transparent.dim_400x200.png`) used in sidebar, mobile nav header, and About Us hero
- Futuristic scan-line / grid background texture via CSS (subtle, non-distracting)
- Glowing border effects on active nav items and key cards
- Animated starfield or grid scan lines in the dashboard hero area
- Monospace/engineering font (JetBrains Mono) for status indicators, timestamps, and data readouts
- HUD-style UI elements: sharp corners on some cards, clipped-corner aesthetic on key panels
- Telemetry/mission-control inspired status bar in dashboard
- Animated pulsing launch/trajectory accent lines on the sidebar logo area

### Modify
- `index.css`: Shift accent from soft cyan to a crisper electric blue-white (#00D4FF / SpaceX palette) with stronger glow intensities. Add scanline and grid CSS utilities. Add futuristic font-face for mono data readouts. Sharper --radius (0.25rem instead of 0.625rem). Background slightly deeper/colder.
- `Layout.tsx`: Replace the old logo `img` with the new SpaceX-style logo. Update sidebar to feel like a mission control panel — add a subtle top gradient pulse, sharper dividers, uppercase monospace nav labels. Active nav item gets a bright glow highlight.
- `Dashboard.tsx`: Greeting section gets a subtle animated background grid. Time/date displayed in monospace engineering style. Quick action chips become sharp-cornered HUD buttons with glow-on-hover. Input bar gets a glowing border.
- All pages: Cards use sharper border-radius and a faint outer glow on hover. Section headers use wider letter-spacing uppercase style.
- `tailwind.config.js`: Add `font-mono` utility, tighten border radius defaults, add new glow shadow tokens for the SpaceX electric blue.

### Remove
- The old rounded "bubbly" aesthetic — soft pill shapes replaced with sharp, clipped aerospace geometry
- The generic `asteroid-logo-new-transparent.dim_512x512.png` reference in Layout and About Us (replaced with new SpaceX-style logo)

## Implementation Plan
1. Update `index.css` — new color tokens (deeper background, electric blue primary, stronger glows, sharper radius), add `@keyframes scan-line`, `grid-hud` background utilities, telemetry font class
2. Update `tailwind.config.js` — add new shadow tokens, tighten radius, confirm mono font
3. Update `Layout.tsx` — swap logo to new SpaceX image, style sidebar as mission control panel, uppercase monospace nav labels, glowing active state
4. Update `Dashboard.tsx` — animated grid background in hero, monospace timestamp, HUD-style quick action buttons, glowing input bar
5. Update `AboutUs.tsx` — swap logo image, sharpen card aesthetic to match futuristic theme
6. Update `Chat.tsx` — header and message bubbles styled with sharper, aerospace-inspired geometry
7. Validate and deploy
