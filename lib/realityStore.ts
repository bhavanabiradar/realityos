"use client";

export type RealityTask = {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
  createdAt: string;
};

export type RealityChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type RealityDecision = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
};

export type RealityEvent = {
  id: string;
  title: string;
  time: string;
  location?: string;
  type?: string;
  createdAt: string;
};

const TASKS_KEY = "realityos_tasks";
const CHAT_KEY = "realityos_chat";
const DECISIONS_KEY = "realityos_decisions";
const EVENTS_KEY = "realityos_events";

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

const defaultDecisions: RealityDecision[] = [
  {
    id: "d1",
    title: "Switched stack to Next.js 15",
    category: "Tech Architecture",
    status: "Finalized",
    createdAt: new Date().toISOString(),
  },
  {
    id: "d2",
    title: "Postponed travel to Oct",
    category: "Logistics",
    status: "Committed",
    createdAt: new Date().toISOString(),
  },
];

const defaultEvents: RealityEvent[] = [
  {
    id: "e1",
    title: "Vision Pro Demo",
    time: "2:30 PM - 3:30 PM",
    location: "Studio A",
    type: "Event",
    createdAt: new Date().toISOString(),
  },
  {
    id: "e2",
    title: "Evening Meditation",
    time: "8:00 PM - 8:30 PM",
    location: "Home",
    type: "Routine",
    createdAt: new Date().toISOString(),
  },
];

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("realityos-data-change"));
  }
}

/* =========================================================
   TASKS
========================================================= */

export function getTasks(): RealityTask[] {
  if (typeof window === "undefined") return defaultTasks;

  try {
    const saved = localStorage.getItem(TASKS_KEY);

    if (!saved) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch {
    return defaultTasks;
  }
}

export function saveTasks(tasks: RealityTask[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  notifyChange();
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

/* =========================================================
   AI CHAT
========================================================= */

export function getChatMessages(): RealityChatMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(CHAT_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: RealityChatMessage[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  notifyChange();
}

export function addChatMessage(message: RealityChatMessage) {
  const messages = getChatMessages();

  const updated = [...messages, message];

  saveChatMessages(updated);

  return updated;
}

export function clearChatMessages() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CHAT_KEY);
  notifyChange();
}

/* =========================================================
   DECISIONS
========================================================= */

export function getDecisions(): RealityDecision[] {
  if (typeof window === "undefined") return defaultDecisions;

  try {
    const saved = localStorage.getItem(DECISIONS_KEY);

    if (!saved) {
      localStorage.setItem(
        DECISIONS_KEY,
        JSON.stringify(defaultDecisions)
      );

      return defaultDecisions;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : defaultDecisions;
  } catch {
    return defaultDecisions;
  }
}

export function saveDecisions(decisions: RealityDecision[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    DECISIONS_KEY,
    JSON.stringify(decisions)
  );

  notifyChange();
}

export function addDecision(
  title: string,
  category = "General",
  status = "Committed"
) {
  const decisions = getDecisions();

  const newDecision: RealityDecision = {
    id: crypto.randomUUID(),
    title,
    category,
    status,
    createdAt: new Date().toISOString(),
  };

  saveDecisions([newDecision, ...decisions]);

  return newDecision;
}

export function deleteDecision(id: string) {
  const decisions = getDecisions();

  const updated = decisions.filter(
    (decision) => decision.id !== id
  );

  saveDecisions(updated);

  return updated;
}

/* =========================================================
   PLANNER EVENTS
========================================================= */

export function getEvents(): RealityEvent[] {
  if (typeof window === "undefined") return defaultEvents;

  try {
    const saved = localStorage.getItem(EVENTS_KEY);

    if (!saved) {
      localStorage.setItem(
        EVENTS_KEY,
        JSON.stringify(defaultEvents)
      );

      return defaultEvents;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

export function saveEvents(events: RealityEvent[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    EVENTS_KEY,
    JSON.stringify(events)
  );

  notifyChange();
}

export function addEvent(
  title: string,
  time: string,
  location = "",
  type = "Event"
) {
  const events = getEvents();

  const newEvent: RealityEvent = {
    id: crypto.randomUUID(),
    title,
    time,
    location: location || undefined,
    type,
    createdAt: new Date().toISOString(),
  };

  saveEvents([newEvent, ...events]);

  return newEvent;
}

export function deleteEvent(id: string) {
  const events = getEvents();

  const updated = events.filter(
    (event) => event.id !== id
  );

  saveEvents(updated);

  return updated;
}