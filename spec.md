# Asteroid

## Current State
The app has three critical bugs causing errors and glitching:
1. Backend Motoko fails to compile: `Int` module is not imported but `Int.compare` is used inside `Task.compare`. Array `.sort()` is called without a comparator. `sliceToArray` does not exist in `mo:core`.
2. `getPreferences` calls `Runtime.trap` for users with no saved preferences, causing Settings to load forever.
3. Task IDs are wrong: the backend stores tasks with Nat map keys (1, 2, 3…) but `getAllTasks()` returns tasks without IDs. The frontend assigns index-based IDs (0, 1, 2…), so `completeTask(0)` looks for key 0 which doesn't exist, causing "Task not found" errors.

## Requested Changes (Diff)

### Add
- `import Int "mo:core/Int"` to backend
- `TaskWithId` type in Motoko (Task fields + `id: Nat`) and all binding files

### Modify
- `getAllTasks`, `getTasksByCategory`, `getTasksByCompletion`, `getTask` now return `[TaskWithId]` with proper `Array.sort` using a named comparator
- `addVoiceLog` uses `Array.tabulate` instead of `sliceToArray`
- `getPreferences` returns sensible defaults instead of trapping
- All binding files updated to reflect `TaskWithId` return types
- `useQueries.ts` updated to use `TaskWithId` directly (no more index-based ID hack)

### Remove
- Old `module Task { compare }` block (replaced with top-level `compareTaskWithId`)
- Index-based ID mapping in `useAllTasks`

## Implementation Plan
1. Rewrite `main.mo` with all fixes
2. Update `declarations/backend.did.d.ts` — add `TaskWithId`, update `_SERVICE`
3. Update `declarations/backend.did.js` — add `TaskWithId` IDL, update `idlService` and `idlFactory`
4. Update `backend.ts` — add `TaskWithId` interface, update `backendInterface` and `Backend` class
5. Update `backend.d.ts` — add `TaskWithId`, update function signatures
6. Update `useQueries.ts` — use `TaskWithId`, remove index ID hack
7. Validate and deploy
