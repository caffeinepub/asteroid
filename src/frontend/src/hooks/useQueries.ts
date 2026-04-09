import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export interface Task {
  title: string;
  category: string;
  completed: boolean;
  dueDate: bigint;
  description: string;
}

export interface TaskWithId extends Task {
  id: bigint;
}

export interface Preferences {
  mode: string;
  speechRate: bigint;
  haptics: boolean;
  language: string;
  wakeWord: string;
  highContrast: boolean;
}

export interface VoiceLog {
  userInput: string;
  assistantResponse: string;
  timestamp: bigint;
}

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<TaskWithId>>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks ? actor.getAllTasks() : [];
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
      return actor.addTask ? actor.addTask(task) : null;
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
      return actor.completeTask ? actor.completeTask(taskId) : null;
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
      return actor.deleteTask ? actor.deleteTask(taskId) : null;
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
          wakeWord: "Hey Quarq",
          highContrast: false,
        } as Preferences;
      return actor.getPreferences
        ? actor.getPreferences(identity.getPrincipal())
        : {
            mode: "Standard",
            speechRate: BigInt(5),
            haptics: true,
            language: "en",
            wakeWord: "Hey Quarq",
            highContrast: false,
          };
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
      return actor.setPreferences ? actor.setPreferences(prefs) : null;
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
      return actor.getVoiceLogs
        ? actor.getVoiceLogs(identity.getPrincipal())
        : [];
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
      return actor.addVoiceLog ? actor.addVoiceLog(log) : null;
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["voiceLogs", identity?.getPrincipal().toString()],
      }),
  });
}
