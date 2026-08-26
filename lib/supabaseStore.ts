import { createClient } from "@/lib/supabase/client";

// =======================
// TASKS
// =======================
export async function fetchUserTasks() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
  return data || [];
}

export async function createDatabaseTask(
  title: string,
  priority: string = "medium",
  category: string = "Personal"
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id: user.id, title, priority, category, completed: false }])
    .select()
    .single();

  if (error) {
    console.error("Error adding task:", error);
    return null;
  }
  return data;
}

export async function toggleDatabaseTask(id: string, completed: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) console.error("Error toggling task:", error);
}

export async function deleteDatabaseTask(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) console.error("Error deleting task:", error);
}

// =======================
// MEMORIES
// =======================
export async function fetchUserMemories() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading memories:", error);
    return [];
  }
  return data || [];
}

export async function createDatabaseMemory(
  title: string,
  type: string = "text",
  summary: string = "",
  size: string = "1 MB",
  date: string = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("memories")
    .insert([{ user_id: user.id, title, type, summary, size, date }])
    .select()
    .single();

  if (error) {
    console.error("Error adding memory:", error);
    return null;
  }
  return data;
}

// =======================
// DECISIONS
// =======================
export async function fetchUserDecisions() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading decisions:", error);
    return [];
  }
  return data || [];
}

export async function createDatabaseDecision(
  title: string,
  category: string = "General",
  status: string = "pending"
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("decisions")
    .insert([{ user_id: user.id, title, category, status }])
    .select()
    .single();

  if (error) {
    console.error("Error adding decision:", error);
    return null;
  }
  return data;
}

// =======================
// EVENTS
// =======================
export async function fetchUserEvents() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading events:", error);
    return [];
  }
  return data || [];
}

export async function createDatabaseEvent(
  title: string,
  timeSlot: string,
  location: string = "home",
  tag: string = "Personal"
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("events")
    .insert([{ user_id: user.id, title, time_slot: timeSlot, location, tag }])
    .select()
    .single();

  if (error) {
    console.error("Error adding event:", error);
    return null;
  }
  return data;
}
// DAILY PRIORITIES
export async function fetchDailyPriorities() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("daily_priorities")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function addDailyPriority(title: string, priority: string = "medium") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("daily_priorities")
    .insert([{ user_id: user.id, title, priority, completed: false }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleDailyPriority(id: string, completed: boolean) {
  const supabase = createClient();
  await supabase.from("daily_priorities").update({ completed }).eq("id", id);
}

export async function deleteDailyPriority(id: string) {
  const supabase = createClient();
  await supabase.from("daily_priorities").delete().eq("id", id);
}

// CHECKLIST & HABIT HISTORY ITEMS
export async function fetchChecklistItems() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("checklist_items")
    .select("*")
    .order("created_at", { ascending: true });
  return data || [];
}

export async function addChecklistItem(title: string, frequency: string, category: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("checklist_items")
    .insert([{
      user_id: user.id,
      title,
      frequency,
      category,
      completed_days: { M: false, T: false, W: false, Th: false, F: false, Sa: false, Su: false },
      is_completed: false
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleChecklistDay(id: string, completedDays: any) {
  const supabase = createClient();
  await supabase.from("checklist_items").update({ completed_days: completedDays }).eq("id", id);
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = createClient();
  await supabase.from("checklist_items").update({ is_completed }).eq("id", id);
}

export async function deleteChecklistItem(id: string) {
  const supabase = createClient();
  await supabase.from("checklist_items").delete().eq("id", id);
}