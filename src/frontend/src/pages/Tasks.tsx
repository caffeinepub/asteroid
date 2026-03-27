import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Circle,
  Home,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import {
  useAddTask,
  useAllTasks,
  useCompleteTask,
  useDeleteTask,
} from "../hooks/useQueries";

interface TasksPageProps {
  onNavigate: (page: AppPage) => void;
}

const SAMPLE_TASKS = [
  {
    id: BigInt(0),
    title: "Team standup meeting",
    category: "work",
    completed: false,
    dueDate: BigInt(0),
    description: "Daily sync with the engineering team",
  },
  {
    id: BigInt(1),
    title: "Review project proposal",
    category: "work",
    completed: false,
    dueDate: BigInt(0),
    description: "Q2 roadmap review",
  },
  {
    id: BigInt(2),
    title: "Pick up groceries",
    category: "home",
    completed: false,
    dueDate: BigInt(0),
    description: "Milk, eggs, bread, and vegetables",
  },
  {
    id: BigInt(3),
    title: "Call the doctor",
    category: "home",
    completed: true,
    dueDate: BigInt(0),
    description: "Schedule annual checkup",
  },
  {
    id: BigInt(4),
    title: "Send follow-up emails",
    category: "work",
    completed: true,
    dueDate: BigInt(0),
    description: "Follow up with client after meeting",
  },
  {
    id: BigInt(5),
    title: "Fix kitchen faucet",
    category: "home",
    completed: false,
    dueDate: BigInt(0),
    description: "Faucet dripping since last week",
  },
];

export default function TasksPage({ onNavigate }: TasksPageProps) {
  const { data: backendTasks = [], isLoading } = useAllTasks();
  const addTask = useAddTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("home");
  const [showForm, setShowForm] = useState(false);

  const tasks = backendTasks.length > 0 ? backendTasks : SAMPLE_TASKS;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask.mutate(
      {
        title: newTitle.trim(),
        category: newCategory,
        completed: false,
        dueDate: BigInt(Date.now()),
        description: "",
      },
      {
        onSuccess: () => {
          setNewTitle("");
          setShowForm(false);
          toast.success("Task added!");
        },
        onError: () => toast.error("Failed to add task"),
      },
    );
  };

  const handleComplete = (id: bigint) => {
    completeTask.mutate(id, {
      onSuccess: () => toast.success("Task completed!"),
      onError: () => toast.error("Failed to complete task"),
    });
  };

  const handleDelete = (id: bigint) => {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success("Task deleted"),
      onError: () => toast.error("Failed to delete task"),
    });
  };

  const filterTasks = (filter: string) => {
    switch (filter) {
      case "home":
        return tasks.filter((t) => t.category === "home" && !t.completed);
      case "work":
        return tasks.filter((t) => t.category === "work" && !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks.filter((t) => !t.completed);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 min-h-[44px]"
        aria-label="Back to dashboard"
        data-ocid="tasks.link"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl text-foreground">
          Tasks
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 font-semibold"
          style={{
            backgroundColor: "oklch(0.83 0.11 195)",
            color: "oklch(0.08 0.002 286)",
          }}
          aria-label="Add new task"
          data-ocid="tasks.primary_button"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Add Task
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
            data-ocid="tasks.panel"
          >
            <form
              onSubmit={handleAdd}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "oklch(0.11 0.005 260)",
                border: "1px solid oklch(0.83 0.11 195 / 30%)",
              }}
            >
              <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                New Task
              </h2>
              <div className="flex flex-col gap-3">
                <div>
                  <Label
                    htmlFor="task-title"
                    className="text-sm text-muted-foreground mb-1"
                  >
                    Task Title
                  </Label>
                  <Input
                    id="task-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="bg-muted text-foreground placeholder:text-muted-foreground"
                    aria-label="Task title"
                    data-ocid="tasks.input"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="task-category"
                    className="text-sm text-muted-foreground mb-1"
                  >
                    Category
                  </Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger
                      id="task-category"
                      className="bg-muted text-foreground"
                      aria-label="Task category"
                      data-ocid="tasks.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    aria-label="Cancel"
                    data-ocid="tasks.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addTask.isPending}
                    className="font-semibold"
                    style={{
                      backgroundColor: "oklch(0.83 0.11 195)",
                      color: "oklch(0.08 0.002 286)",
                    }}
                    aria-label="Save task"
                    data-ocid="tasks.submit_button"
                  >
                    {addTask.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save Task"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="all" data-ocid="tasks.panel">
        <TabsList
          className="w-full mb-4 grid grid-cols-4"
          style={{ backgroundColor: "oklch(0.11 0.005 260)" }}
        >
          <TabsTrigger value="all" data-ocid="tasks.tab" aria-label="All tasks">
            All
          </TabsTrigger>
          <TabsTrigger
            value="home"
            data-ocid="tasks.tab"
            aria-label="Home tasks"
          >
            Home
          </TabsTrigger>
          <TabsTrigger
            value="work"
            data-ocid="tasks.tab"
            aria-label="Work tasks"
          >
            Work
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            data-ocid="tasks.tab"
            aria-label="Completed tasks"
          >
            Done
          </TabsTrigger>
        </TabsList>

        {["all", "home", "work", "completed"].map((filter) => (
          <TabsContent key={filter} value={filter}>
            {isLoading ? (
              <div
                className="flex items-center justify-center py-12"
                data-ocid="tasks.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <TaskList
                tasks={filterTasks(filter)}
                onComplete={handleComplete}
                onDelete={handleDelete}
                isCompleted={filter === "completed"}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface TaskListProps {
  tasks: Array<{
    id: bigint;
    title: string;
    category: string;
    completed: boolean;
  }>;
  onComplete: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  isCompleted: boolean;
}

function TaskList({ tasks, onComplete, onDelete, isCompleted }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div
        className="text-center py-16 rounded-xl"
        style={{
          backgroundColor: "oklch(0.11 0.005 260)",
          border: "1px solid oklch(0.92 0.005 260 / 12%)",
        }}
        data-ocid="tasks.empty_state"
      >
        <CheckCircle2
          className="w-12 h-12 text-muted-foreground mx-auto mb-3"
          aria-hidden
        />
        <p className="text-muted-foreground">No tasks here!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {tasks.map((task, i) => (
          <motion.div
            key={task.id.toString()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl p-4 group"
            style={{
              backgroundColor: "oklch(0.11 0.005 260)",
              border: "1px solid oklch(0.92 0.005 260 / 12%)",
            }}
            data-ocid={`tasks.item.${i + 1}`}
          >
            <div
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  task.category === "work"
                    ? "oklch(0.52 0.22 261)"
                    : "oklch(0.78 0.16 155)",
              }}
              aria-hidden
            />

            {!isCompleted && (
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="flex-shrink-0 w-6 h-6 min-w-[24px] min-h-[24px]"
                aria-label={`Mark "${task.title}" as complete`}
                data-ocid={`tasks.checkbox.${i + 1}`}
              >
                <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
            {isCompleted && (
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "oklch(0.78 0.16 155)" }}
                aria-label="Completed"
              />
            )}

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isCompleted
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {task.category === "work" ? (
                  <Briefcase
                    className="w-3 h-3 text-muted-foreground"
                    aria-hidden
                  />
                ) : (
                  <Home className="w-3 h-3 text-muted-foreground" aria-hidden />
                )}
                <span className="text-xs text-muted-foreground capitalize">
                  {task.category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Delete task "${task.title}"`}
              data-ocid={`tasks.delete_button.${i + 1}`}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
