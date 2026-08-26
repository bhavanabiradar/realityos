"use client";

/* =========================================================
   REALITYOS STORE
   Scoped per-user localStorage store for RealityOS
========================================================= */

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

export type RealityChat = {
  id: string;
  title: string;
  messages: RealityChatMessage[];
  createdAt: string;
  updatedAt: string;
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

// Helper to get active user ID or email from Supabase auth token in localStorage
function getUserPrefix(): string {
  if (typeof window === "undefined") return "guest";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          const userId = parsed?.user?.id || parsed?.user?.email;
          if (userId) return userId;
        }
      }
    }
  } catch {
    // fallback to guest if parsing fails
  }
  return "guest";
}

const getTasksKey = () => `realityos_${getUserPrefix()}_tasks`;
const getChatHistoryKey = () => `realityos_${getUserPrefix()}_chat_history`;
const getDecisionsKey = () => `realityos_${getUserPrefix()}_decisions`;
const getEventsKey = () => `realityos_${getUserPrefix()}_events`;

function generateId(prefix = "reality") {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("realityos-data-change"));
  }
}

/* =========================================================
   TASKS
========================================================= */

export function getTasks(): RealityTask[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(getTasksKey());
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: RealityTask[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTasksKey(), JSON.stringify(tasks));
  notifyChange();
}

export function addTask(
  title: string,
  category = "General",
  priority: RealityTask["priority"] = "Medium"
) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;
  const tasks = getTasks();
  const newTask: RealityTask = {
    id: generateId("task"),
    title: cleanTitle,
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
    task.id === id ? { ...task, done: !task.done } : task
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
   CHAT HISTORY & MEMORY
========================================================= */

export function getChatHistory(): RealityChat[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(getChatHistoryKey());
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter(
      (chat) => chat.messages && chat.messages.some((m: RealityChatMessage) => m.role === "user")
    );
  } catch {
    return [];
  }
}

export function saveChatHistory(chats: RealityChat[]) {
  if (typeof window === "undefined") return;
  const validChats = chats.filter(
    (chat) => chat.messages && chat.messages.some((m) => m.role === "user")
  );
  localStorage.setItem(getChatHistoryKey(), JSON.stringify(validChats));
  notifyChange();
}

export function getChats(): RealityChat[] {
  return getChatHistory();
}

export function getChat(id: string): RealityChat | null {
  const history = getChatHistory();
  return history.find((chat) => chat.id === id) ?? null;
}

export function updateChat(id: string, messages: RealityChatMessage[]) {
  const history = getChatHistory();
  let found = false;

  const firstUserMsg = messages.find((m) => m.role === "user");
  const generatedTitle = firstUserMsg?.content?.trim().slice(0, 30) || "Conversation";

  const updated = history.map((chat) => {
    if (chat.id !== id) return chat;
    found = true;
    return {
      ...chat,
      messages,
      title: chat.title === "New Chat" ? generatedTitle : chat.title,
      updatedAt: new Date().toISOString(),
    };
  });

  if (!found && messages.some((m) => m.role === "user")) {
    updated.unshift({
      id,
      title: generatedTitle,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  saveChatHistory(updated);
  return updated.find((chat) => chat.id === id) ?? null;
}

export function updateChatMessages(chatId: string, messages: RealityChatMessage[]) {
  return updateChat(chatId, messages);
}

export function renameChat(chatId: string, title: string) {
  const chats = getChatHistory();
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;

  const updatedChats = chats.map((chat) =>
    chat.id === chatId
      ? { ...chat, title: cleanTitle, updatedAt: new Date().toISOString() }
      : chat
  );

  saveChatHistory(updatedChats);
  return updatedChats.find((chat) => chat.id === chatId) ?? null;
}

export function deleteChat(chatId: string) {
  const chats = getChatHistory();
  const updatedChats = chats.filter((chat) => chat.id !== chatId);
  saveChatHistory(updatedChats);
  return updatedChats;
}

export function getCrossChatMemories(excludeChatId?: string | null): string[] {
  const history = getChatHistory();
  const memories: string[] = [];

  history
    .filter((c) => c.id !== excludeChatId)
    .slice(0, 5)
    .forEach((c) => {
      const userMsgs = c.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ");
      if (userMsgs) {
        memories.push(`[Topic: ${c.title}]: User said -> ${userMsgs.slice(0, 300)}`);
      }
    });

  return memories;
}

/* =========================================================
   DECISIONS & EVENTS
========================================================= */

export function getDecisions(): RealityDecision[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(getDecisionsKey());
    if (!saved) return [];
    return JSON.parse(saved) || [];
  } catch {
    return [];
  }
}

export function saveDecisions(decisions: RealityDecision[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getDecisionsKey(), JSON.stringify(decisions));
  notifyChange();
}

export function addDecision(title: string, category = "General", status = "Committed") {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;
  const decisions = getDecisions();
  const newDecision: RealityDecision = {
    id: generateId("decision"),
    title: cleanTitle,
    category,
    status,
    createdAt: new Date().toISOString(),
  };
  saveDecisions([newDecision, ...decisions]);
  return newDecision;
}

export function deleteDecision(id: string) {
  const decisions = getDecisions();
  const updated = decisions.filter((d) => d.id !== id);
  saveDecisions(updated);
  return updated;
}

export function getEvents(): RealityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(getEventsKey());
    if (!saved) return [];
    return JSON.parse(saved) || [];
  } catch {
    return [];
  }
}

export function saveEvents(events: RealityEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getEventsKey(), JSON.stringify(events));
  notifyChange();
}

export function addEvent(title: string, time: string, location = "", type = "Event") {
  const cleanTitle = title.trim();
  if (!cleanTitle) return null;
  const events = getEvents();
  const newEvent: RealityEvent = {
    id: generateId("event"),
    title: cleanTitle,
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
  const updated = events.filter((e) => e.id !== id);
  saveEvents(updated);
  return updated;
}