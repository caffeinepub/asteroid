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
    category : Text; // "home" or "work"
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
    let newLogs = [log].concat(userLogs);
    let trimmedLogs = if (newLogs.size() > 10) {
      Array.tabulate(10, func(i : Nat) : VoiceLog { newLogs[i] })
    } else {
      newLogs
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

  public shared func setOpenAIKey(key : Text) : async () {
    openaiKey := ?key;
  };

  public query func hasOpenAIKey() : async Bool {
    switch (openaiKey) {
      case (?key) { key.size() > 0 };
      case (null) { false };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func chatWithAI(message : Text) : async Text {
    switch (openaiKey) {
      case (null) {
        "OpenAI API key not set. Please provide a valid API key.";
      };
      case (?key) {
        let headers = [
          {
            name = "Authorization";
            value = "Bearer " # key;
          },
          {
            name = "Content-Type";
            value = "application/json";
          },
        ];
        let systemPrompt = "You are Asteroid, a helpful virtual assistant for managing daily tasks, navigation, and accessibility. Be concise and friendly.";
        let body = (
          "{ \"model\": \"gpt-4o-mini\", " #
          "\"messages\": [" #
          "{\"role\":\"system\",\"content\":\""
        ) # systemPrompt #
        ("\"}," #
        "{\"role\":\"user\",\"content\":\"" # message # "\"}], \"max_tokens\": 300 }");
        let result = await OutCall.httpPostRequest(
          "https://api.openai.com/v1/chat/completions",
          headers,
          body,
          transform,
        );
        result;
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
