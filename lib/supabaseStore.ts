import { createClient } from "@/lib/supabase/client";

// ==========================================
// 1. CHAT SESSIONS & SESSION MESSAGES
// ==========================================

export async function fetchChatSessions() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
  return data || [];
}

export async function createChatSession(title: string = "New Conversation") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ user_id: user.id, title }])
    .select()
    .single();

  if (error) {
    console.error("Error creating session:", error);
    return null;
  }
  return data;
}

export async function renameChatSession(sessionId: string, title: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", user.id);
}

export async function deleteChatSession(sessionId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);
}

export async function fetchSessionMessages(sessionId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching session messages:", error);
    return [];
  }
  return data || [];
}

export async function saveSessionChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  attachmentName?: string,
  attachmentUrl?: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        user_id: user.id,
        session_id: sessionId,
        role,
        content,
        attachment_name: attachmentName || null,
        attachment_url: attachmentUrl || null,
      },
    ])
    .select()
    .single();

  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) {
    console.error("Error saving message:", error);
    return null;
  }
  return data;
}

// Flat Chat Fallbacks
export async function fetchUserChatHistory() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
  return data || [];
}

export async function saveChatMessage(role: "user" | "assistant", content: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_messages")
    .insert([{ user_id: user.id, role, content }])
    .select()
    .single();

  if (error) {
    console.error("Error saving chat message:", error);
    return null;
  }
  return data;
}

// ==========================================
// 2. DOCUMENTS
// ==========================================

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
    console.error("Error adding document:", error);
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

// ==========================================
// 3. EMERGENCY CONTACTS
// ==========================================

export async function fetchEmergencyContacts() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading emergency contacts:", error);
    return [];
  }
  return data || [];
}

export async function addEmergencyContact(name: string, relation: string, phone: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("emergency_contacts")
    .insert([
      {
        user_id: user.id,
        name,
        relation,
        phone,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding emergency contact:", error);
    return null;
  }
  return data;
}

export async function deleteEmergencyContact(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("emergency_contacts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("Error deleting emergency contact:", error);
}

// ==========================================
// 4. TASKS & CHECKLIST ITEMS
// ==========================================

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
export async function updateSessionChatMessage(
  messageId: string,
  content: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_messages")
    .update({ content })
    .eq("id", messageId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update chat message:", error);
    throw error;
  }

  return data;
}