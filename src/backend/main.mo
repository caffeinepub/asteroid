import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import OutCall "http-outcalls/outcall";



actor {
  /**************/
  /* DATA TYPES */
  /**************/

  type Task = {
    title : Text;
    description : Text;
    category : Text;
    dueDate : Int;
    completed : Bool;
  };

  type TaskWithId = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    dueDate : Int;
    completed : Bool;
  };

  func toTaskWithId(id : Nat, task : Task) : TaskWithId {
    {
      id = id;
      title = task.title;
      description = task.description;
      category = task.category;
      dueDate = task.dueDate;
      completed = task.completed;
    }
  };

  func compareTaskWithId(t1 : TaskWithId, t2 : TaskWithId) : Order.Order {
    switch (t1.completed, t2.completed) {
      case (true, false) { #greater };
      case (false, true) { #less };
      case (_, _) { Int.compare(t1.dueDate, t2.dueDate) };
    };
  };

  type Preferences = {
    speechRate : Nat;
    language : Text;
    highContrast : Bool;
    haptics : Bool;
    mode : Text;
    wakeWord : Text;
  };

  type VoiceLog = {
    userInput : Text;
    assistantResponse : Text;
    timestamp : Int;
  };

  /***************/
  /* STORAGE */
  /***************/

  var nextTaskId = 4;

  let tasks = Map.fromIter<Nat, Task>([
    (1, {
      title = "Buy groceries";
      description = "Pick up milk, eggs, and bread";
      category = "home";
      dueDate = 1718275200;
      completed = false;
    }),
    (2, {
      title = "Finish report";
      description = "Complete quarterly earnings report";
      category = "work";
      dueDate = 1718361600;
      completed = false;
    }),
    (3, {
      title = "Call plumber";
      description = "Fix kitchen sink leak";
      category = "home";
      dueDate = 1718448000;
      completed = false;
    }),
  ].values());

  let preferences = Map.empty<Principal, Preferences>();

  let voiceLogs = Map.empty<Principal, [VoiceLog]>();

  var openaiKey : ?Text = null;
  var aiProvider : Text = "openai"; // "openai" | "gemini" | "groq" | "cohere"

  /**************/
  /* OPERATIONS */
  /**************/

  public shared func addTask(task : Task) : async Nat {
    let taskId = nextTaskId;
    tasks.add(taskId, task);
    nextTaskId += 1;
    taskId;
  };

  public shared func updateTask(taskId : Nat, task : Task) : async () {
    if (not tasks.containsKey(taskId)) { Runtime.trap("Task not found") };
    tasks.add(taskId, task);
  };

  public shared func completeTask(taskId : Nat) : async () {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        tasks.add(
          taskId,
          {
            task with
            completed = true;
          },
        );
      };
    };
  };

  public shared func deleteTask(taskId : Nat) : async () {
    if (not tasks.containsKey(taskId)) { Runtime.trap("Task not found") };
    tasks.remove(taskId);
  };

  public query func getAllTasks() : async [TaskWithId] {
    let entries = tasks.entries().map(func (kv : (Nat, Task)) : TaskWithId {
      toTaskWithId(kv.0, kv.1)
    }).toArray();
    entries.sort(compareTaskWithId)
  };

  public query func getTasksByCategory(category : Text) : async [TaskWithId] {
    let entries = tasks.entries()
      .filter(func (kv : (Nat, Task)) : Bool { kv.1.category == category })
      .map(func (kv : (Nat, Task)) : TaskWithId { toTaskWithId(kv.0, kv.1) })
      .toArray();
    entries.sort(compareTaskWithId)
  };

  public query func getTasksByCompletion(completed : Bool) : async [TaskWithId] {
    let entries = tasks.entries()
      .filter(func (kv : (Nat, Task)) : Bool { kv.1.completed == completed })
      .map(func (kv : (Nat, Task)) : TaskWithId { toTaskWithId(kv.0, kv.1) })
      .toArray();
    entries.sort(compareTaskWithId)
  };

  public shared ({ caller }) func setPreferences(prefs : Preferences) : async () {
    preferences.add(caller, prefs);
  };

  public query func getPreferences(user : Principal) : async Preferences {
    switch (preferences.get(user)) {
      case (null) {
        {
          speechRate = 5;
          language = "en";
          highContrast = false;
          haptics = true;
          mode = "Standard";
          wakeWord = "Hey Asteroid";
        }
      };
      case (?prefs) { prefs };
    };
  };

  public shared ({ caller }) func addVoiceLog(log : VoiceLog) : async () {
    let userLogs = switch (voiceLogs.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
    let combined = Array.tabulate(userLogs.size() + 1, func(i : Nat) : VoiceLog {
      if (i == 0) { log } else { userLogs[i - 1] }
    });
    let trimmedLogs = if (combined.size() > 10) {
      Array.tabulate(10, func(i : Nat) : VoiceLog { combined[i] })
    } else {
      combined
    };
    voiceLogs.add(caller, trimmedLogs);
  };

  public query func getVoiceLogs(user : Principal) : async [VoiceLog] {
    switch (voiceLogs.get(user)) {
      case (null) { [] };
      case (?logs) { logs };
    };
  };

  /**************/
  /* AI Features */
  /**************/

  // Legacy: keep for backward compat
  public shared func setOpenAIKey(key : Text) : async () {
    openaiKey := ?key;
    aiProvider := "openai";
  };

  // New: set provider + key together
  public shared func setAIConfig(provider : Text, key : Text) : async () {
    aiProvider := provider;
    openaiKey := ?key;
  };

  public query func hasOpenAIKey() : async Bool {
    switch (openaiKey) {
      case (?key) { key.size() > 0 };
      case (null) { false };
    };
  };

  public query func getAIProvider() : async Text {
    aiProvider;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func chatWithAI(message : Text) : async Text {
    switch (openaiKey) {
      case (null) {
        "AI not configured. Please set up an API key in Settings.";
      };
      case (?key) {
        if (key.size() == 0) {
          return "AI not configured. Please set up an API key in Settings.";
        };
        let systemPrompt = "You are Asteroid, a helpful virtual assistant for managing daily tasks, navigation, and accessibility. Be concise and friendly.";

        if (aiProvider == "gemini") {
          // Google Gemini
          let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # key;
          let headers = [{
            name = "Content-Type";
            value = "application/json";
          }];
          let body = "{\"contents\":[{\"parts\":[{\"text\":\"" # systemPrompt # "\\n\\nUser: " # message # "\"}]}]}";
          await OutCall.httpPostRequest(url, headers, body, transform);
        } else if (aiProvider == "groq") {
          // Groq
          let headers = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type"; value = "application/json" },
          ];
          let body = (
            "{ \"model\": \"llama3-8b-8192\", " #
            "\"messages\": [" #
            "{\"role\":\"system\",\"content\":\"" # systemPrompt # "\"}," #
            "{\"role\":\"user\",\"content\":\"" # message # "\"}], \"max_tokens\": 300 }"
          );
          await OutCall.httpPostRequest("https://api.groq.com/openai/v1/chat/completions", headers, body, transform);
        } else if (aiProvider == "cohere") {
          // Cohere
          let headers = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type"; value = "application/json" },
          ];
          let body = (
            "{ \"model\": \"command-r\", " #
            "\"message\": \"" # message # "\", " #
            "\"preamble\": \"" # systemPrompt # "\", " #
            "\"max_tokens\": 300 }"
          );
          await OutCall.httpPostRequest("https://api.cohere.com/v1/chat", headers, body, transform);
        } else {
          // Default: OpenAI
          let headers = [
            { name = "Authorization"; value = "Bearer " # key },
            { name = "Content-Type"; value = "application/json" },
          ];
          let body = (
            "{ \"model\": \"gpt-4o-mini\", " #
            "\"messages\": [" #
            "{\"role\":\"system\",\"content\":\"" # systemPrompt # "\"}," #
            "{\"role\":\"user\",\"content\":\"" # message # "\"}], \"max_tokens\": 300 }"
          );
          await OutCall.httpPostRequest("https://api.openai.com/v1/chat/completions", headers, body, transform);
        };
      };
    };
  };

  public query func getTask(taskId : Nat) : async TaskWithId {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { toTaskWithId(taskId, task) };
    };
  };
};
