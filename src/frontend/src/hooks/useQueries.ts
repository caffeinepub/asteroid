import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Preferences, Task, TaskWithId, VoiceLog } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<TaskWithId>>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error("No actor");
      return actor.addTask(task);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.completeTask(taskId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteTask(taskId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function usePreferences() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Preferences>({
    queryKey: ["preferences", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity)
        return {
          mode: "Standard",
          speechRate: BigInt(5),
          haptics: true,
          language: "en",
          wakeWord: "Hey Asteroid",
          highContrast: false,
        } as Preferences;
      return actor.getPreferences(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePreferences() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (prefs: Preferences) => {
      if (!actor) throw new Error("No actor");
      return actor.setPreferences(prefs);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["preferences", identity?.getPrincipal().toString()],
      }),
  });
}

export function useVoiceLogs() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<VoiceLog[]>({
    queryKey: ["voiceLogs", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getVoiceLogs(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddVoiceLog() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (log: VoiceLog) => {
      if (!actor) throw new Error("No actor");
      return actor.addVoiceLog(log);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["voiceLogs", identity?.getPrincipal().toString()],
      }),
  });
}
