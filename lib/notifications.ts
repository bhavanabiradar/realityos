// lib/notifications.ts
import { createClient } from "@/lib/supabase/client";

export async function checkAndSendInactivityReminder(userEmail: string) {
  const supabase = createClient();

  try {
    // Fetch user's last activity or profile update
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("last_active_at, streak_count")
      .eq("email", userEmail)
      .single();

    if (error || !profile) return;

    const lastActive = new Date(profile.last_active_at || Date.now());
    const now = new Date();
    const diffDays = Math.abs(now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    // If inactive for 2 or more days, trigger notification logic
    if (diffDays >= 2) {
      console.log("User inactive for 2+ days. Triggering reminder notification...");
      
      // Call Supabase Edge Function or API route to dispatch Gmail notification
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          streak: profile.streak_count || 0,
          type: "INACTIVITY_REMINDER",
        }),
      });
    }
  } catch (err) {
    console.error("Error checking notification status:", err);
  }
}