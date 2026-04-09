// biome-ignore lint: generated shim
import { useActor as _useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useActor(): { actor: any | null; isFetching: boolean } {
  // biome-ignore lint: generated shim
  return _useActor(createActor as any);
}
