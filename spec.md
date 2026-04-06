# Quarq/AI — Offline Mode for Aster Chat

## Current State
Chat.tsx provides a chat interface for Aster that routes messages through `useAI()` hook which calls the backend canister's AI proxy (OpenAI, Gemini, Groq, Cohere). There is no offline/local mode. When AI is not configured, a warning banner is shown. The chat header shows a status bar and AI active/offline indicator.

## Requested Changes (Diff)

### Add
- **Offline Mode Toggle Switch** in Chat header — a labeled switch (`ONLINE / OFFLINE`) that lets users toggle between backend AI and the local rule-based engine. State persisted in localStorage.
- **Rule-Based AI Engine** (`src/frontend/src/lib/offlineAI.ts`) — a comprehensive pattern-matching assistant covering 10,000+ work and household scenarios across categories:
  - **Productivity & Work**: task management, scheduling, meetings, deadlines, email, reports, presentations, project management
  - **Home & Household**: cooking, recipes, cleaning, laundry, grocery lists, appliances, home maintenance, DIY repairs
  - **Health & Wellness**: exercise, nutrition, sleep, mental health, first aid, medication reminders
  - **Finance**: budgeting, bills, savings, expenses, banking basics
  - **Travel & Navigation**: directions, transport, packing, trip planning
  - **Tech & Devices**: phone help, computer troubleshooting, apps, internet
  - **Education & Learning**: study tips, math help, writing, languages
  - **Social & Communication**: drafting messages, conversation tips, etiquette
  - **Emergency & Safety**: emergency contacts, safety procedures, first aid
  - **Accessibility**: screen reader tips, voice control, assistive tech
  - **Smart fallback**: If no specific rule matches, a context-aware intelligent fallback response is generated
- When in offline mode, the header badge changes to `OFFLINE MODE` (amber) and the input placeholder updates accordingly
- The "AI not configured" banner is suppressed when offline mode is active (offline mode is always available)

### Modify
- `Chat.tsx`: Add offline mode state, toggle switch in header, and route `handleSend` through `offlineAI` when offline mode is on
- Intro message changes slightly in offline mode to indicate local processing

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/lib/offlineAI.ts` with a comprehensive rule-based engine:
   - Pattern matching via regex against 200+ intent patterns
   - Each pattern maps to a rich, multi-sentence response
   - Categories: productivity, household, health, finance, travel, tech, education, social, emergency, accessibility, Aster-self
   - Smart fallback that acknowledges the query and provides general guidance
   - `processOfflineMessage(text: string): string` export
2. Update `Chat.tsx`:
   - Import `processOfflineMessage` from `offlineAI`
   - Add `offlineMode` state (default false, persisted in localStorage key `aster-offline-mode`)
   - Add toggle switch in header using shadcn `Switch` component + `Label`
   - In `handleSend`: if `offlineMode`, call `processOfflineMessage` synchronously (wrapped in a short artificial delay for UX)
   - Suppress AI config banner when in offline mode
   - Update placeholder and status text based on mode
