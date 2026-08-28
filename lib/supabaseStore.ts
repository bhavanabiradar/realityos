import { createClient } from "@/lib/supabase/client";

// =======================
// TASKS & DAILY PRIORITIES
// =======================

export async function fetchDailyPriorities() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading priorities:", error);
    return [];
  }
  return data || [];
}

export async function addDailyPriority(
  title: string,
  priority: string = "medium",
  category: string = "Personal"
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: user.id,
        title,
        priority,
        category,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding priority:", error);
    return null;
  }
  return data;
}

export async function toggleDailyPriority(id: string, completed: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error toggling priority:", error);
}

export async function deleteDailyPriority(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error deleting priority:", error);
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
    .eq("user_id", user.id)
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
    .insert([
      {
        user_id: user.id,
        title,
        time_slot: timeSlot,
        location,
        tag,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding event:", error);
    return null;
  }
  return data;
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
    .eq("user_id", user.id)
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
  summary: string = ""
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("memories")
    .insert([
      {
        user_id: user.id,
        title,
        type,
        summary,
        size: "1 MB",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding memory:", error);
    return null;
  }
  return data;
}

export async function deleteDatabaseMemory(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error deleting memory:", error);
}

// =======================
// DOCUMENTS
// =======================

export async function fetchUserDocuments() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading documents:", error);
    return [];
  }
  return data || [];
}

export async function createDatabaseDocument(
  name: string,
  size: string = "1 MB",
  file_url: string = ""
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        user_id: user.id,
        name,
        size,
        file_url,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    return null;
  }
  return data;
}

export async function deleteDatabaseDocument(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error deleting document:", error);
}

// =======================
// CHECKLIST & HABITS
// =======================

export async function fetchChecklistItems() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading checklist items:", error);
    return [];
  }
  return data || [];
}

export async function addChecklistItem(
  title: string,
  frequency: string = "daily",
  category: string = "Routine & Health"
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("checklist_items")
    .insert([
      {
        user_id: user.id,
        title,
        frequency,
        category,
        completed_days: {
          M: false,
          T: false,
          W: false,
          Th: false,
          F: false,
          Sa: false,
          Su: false,
        },
        is_completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding checklist item:", error);
    return null;
  }
  return data;
}

export async function toggleChecklistDay(id: string, completedDays: any) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("checklist_items")
    .update({ completed_days: completedDays })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error toggling checklist day:", error);
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("checklist_items")
    .update({ is_completed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error toggling checklist item:", error);
}

export async function deleteChecklistItem(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error deleting checklist item:", error);
}

// =======================
// USER STREAKS
// =======================

export async function fetchUserStreak() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from("user_streaks")
    .select("weekly_streaks")
    .eq("user_id", user.id)
    .single();

  if (error) return 0;
  return data?.weekly_streaks || 0;
}

export async function updateUserStreak(weekly_streaks: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_streaks").upsert({
    user_id: user.id,
    weekly_streaks,
    updated_at: new Date().toISOString(),
  });
}