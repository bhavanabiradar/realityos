// lib/notifications.ts
import { createClient } from "@/lib/supabase/client";

export async function checkAndSendInactivityReminder(userEmail: string) {
  if (!userEmail) return;
  const supabase = createClient();

  try {
    // Safely check user profile without crashing if columns don't exist yet
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_active_at, streak_count")
      .eq("email", userEmail)
      .maybeSingle();

    if (!profile) return;

    const lastActive = new Date(profile.last_active_at || Date.now());
    const now = new Date();
    const diffDays = Math.abs(now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    // If inactive for 2 or more days, trigger notification
    if (diffDays >= 2) {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          streak: profile.streak_count || 0,
          type: "INACTIVITY_REMINDER",
        }),
      }).catch(() => {}); // Catch fetch errors silently so UI never breaks
    }
  } catch (err) {
    // Silently catch background errors so app execution is never interrupted
    console.log("Notification check skipped:", err);
  }
}