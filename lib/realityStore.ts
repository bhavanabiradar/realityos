"use client";

export type RealityTask = {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
  createdAt: string;
};

const TASKS_KEY = "realityos_tasks";
const MEMORY_KEY = "realityos_memory";

const defaultTasks: RealityTask[] = [
  {
    id: "1",
    title: "Design System Sync",
    category: "Project Reality",
    priority: "High",
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review Q3 Roadmap",
    category: "Planning",
    priority: "Medium",
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Update RealityOS Docs",
    category: "Development",
    priority: "Low",
    done: false,
    createdAt: new Date().toISOString(),
  },
];

export function getTasks(): RealityTask[] {
  if (typeof window === "undefined") return defaultTasks;

  try {
    const saved = localStorage.getItem(TASKS_KEY);

    if (!saved) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }

    return JSON.parse(saved);
  } catch {
    return defaultTasks;
  }
}

export function saveTasks(tasks: RealityTask[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  window.dispatchEvent(new Event("realityos-data-change"));
}

export function addTask(
  title: string,
  category = "General",
  priority: RealityTask["priority"] = "Medium"
) {
  const tasks = getTasks();

  const newTask: RealityTask = {
    id: crypto.randomUUID(),
    title,
    category,
    priority,
    done: false,
    createdAt: new Date().toISOString(),
  };

  saveTasks([newTask, ...tasks]);

  return newTask;
}

export function toggleTask(id: string) {
  const tasks = getTasks();

  const updated = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          done: !task.done,
        }
      : task
  );

  saveTasks(updated);

  return updated;
}

export function deleteTask(id: string) {
  const tasks = getTasks();

  const updated = tasks.filter((task) => task.id !== id);

  saveTasks(updated);

  return updated;
}

export function getLifeScore() {
  const tasks = getTasks();

  if (tasks.length === 0) return 72;

  const completed = tasks.filter((task) => task.done).length;

  const completionRate = completed / tasks.length;

  return Math.min(100, Math.round(60 + completionRate * 40));
}