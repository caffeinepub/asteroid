import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    title: string;
    completed: boolean;
    dueDate: bigint;
    description: string;
    category: string;
}
export interface VoiceLog {
    userInput: string;
    assistantResponse: string;
    timestamp: bigint;
}
export interface Preferences {
    mode: string;
    speechRate: bigint;
    haptics: boolean;
    language: string;
    wakeWord: string;
    highContrast: boolean;
}
export interface backendInterface {
    /**
     * / ***********
     * / ***********
     */
    addTask(task: Task): Promise<bigint>;
    addVoiceLog(log: VoiceLog): Promise<void>;
    completeTask(taskId: bigint): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getPreferences(user: Principal): Promise<Preferences>;
    getTask(taskId: bigint): Promise<Task>;
    getTasksByCategory(category: string): Promise<Array<Task>>;
    getTasksByCompletion(completed: boolean): Promise<Array<Task>>;
    getVoiceLogs(user: Principal): Promise<Array<VoiceLog>>;
    setPreferences(prefs: Preferences): Promise<void>;
    updateTask(taskId: bigint, task: Task): Promise<void>;
}
