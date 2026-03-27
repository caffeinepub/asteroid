import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";

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

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      switch (task1.completed, task2.completed) {
        case (true, false) { return #greater };
        case (false, true) { return #less };
        case (_, _) { Int.compare(task1.dueDate, task2.dueDate) };
      };
    };
  };

  type Preferences = {
    speechRate : Nat;
    language : Text;
    highContrast : Bool;
    haptics : Bool;
    mode : Text; // "standard", "gravity", "earth"
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

  /**************/
  /* OPERATIONS */
  /**************/

  public shared ({ caller }) func addTask(task : Task) : async Nat {
    let taskId = nextTaskId;
    tasks.add(taskId, task);
    nextTaskId += 1;
    taskId;
  };

  public shared ({ caller }) func updateTask(taskId : Nat, task : Task) : async () {
    if (not tasks.containsKey(taskId)) { Runtime.trap("Task not found") };
    tasks.add(taskId, task);
  };

  public shared ({ caller }) func completeTask(taskId : Nat) : async () {
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

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not tasks.containsKey(taskId)) { Runtime.trap("Task not found") };
    tasks.remove(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.values().toArray().sort();
  };

  public query ({ caller }) func getTasksByCategory(category : Text) : async [Task] {
    tasks.values().toArray().filter(func(task) { task.category == category }).sort();
  };

  public query ({ caller }) func getTasksByCompletion(completed : Bool) : async [Task] {
    tasks.values().toArray().filter(func(task) { task.completed == completed }).sort();
  };

  public shared ({ caller }) func setPreferences(prefs : Preferences) : async () {
    preferences.add(caller, prefs);
  };

  public query ({ caller }) func getPreferences(user : Principal) : async Preferences {
    switch (preferences.get(user)) {
      case (null) { Runtime.trap("Preferences not found") };
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
      newLogs.sliceToArray(0, 10);
    } else {
      newLogs;
    };
    voiceLogs.add(caller, trimmedLogs);
  };

  public query ({ caller }) func getVoiceLogs(user : Principal) : async [VoiceLog] {
    switch (voiceLogs.get(user)) {
      case (null) { [] };
      case (?logs) { logs };
    };
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };
};
