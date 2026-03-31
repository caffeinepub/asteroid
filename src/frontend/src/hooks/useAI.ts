import { useCallback } from "react";
import { useActor } from "./useActor";

export function useAI() {
  const { actor } = useActor();

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!actor) throw new Error("NO_ACTOR");
      return actor.chatWithAI(message);
    },
    [actor],
  );

  const checkAIConfigured = useCallback(async (): Promise<boolean> => {
    if (!actor) return false;
    try {
      return await actor.hasOpenAIKey();
    } catch {
      return false;
    }
  }, [actor]);

  return { sendMessage, checkAIConfigured };
}
