import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildNotificationEmail } from "@/lib/email/notificationTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  // Protect this route so only Vercel Cron (with the secret) can trigger it
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Find users inactive for 2+ days who haven't been notified in the last day
  const { data: inactiveUsers, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, last_active_at, last_notified_at")
    .lt("last_active_at", twoDaysAgo)
    .or(`last_notified_at.is.null,last_notified_at.lt.${oneDayAgo}`);

  if (error) {
    console.error("Failed to fetch inactive users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!inactiveUsers || inactiveUsers.length === 0) {
    return NextResponse.json({ message: "No inactive users to notify." });
  }

  const results = [];

  for (const user of inactiveUsers) {
    if (!user.email) continue;

    const daysInactive = Math.floor(
      (Date.now() - new Date(user.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Pending tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("title")
      .eq("user_id", user.id)
      .eq("completed", false)
      .limit(5);

    // Upcoming events
    const { data: events } = await supabase
      .from("events")
      .select("title, time")
      .eq("user_id", user.id)
      .limit(5);

    // Pending decisions
    const { data: decisions } = await supabase
      .from("decisions")
      .select("title")
      .eq("user_id", user.id)
      .eq("status", "Pending")
      .limit(5);

    const { subject, html } = buildNotificationEmail({
      fullName: user.full_name,
      daysInactive,
      tasks: tasks || [],
      events: events || [],
      decisions: decisions || [],
    });

    try {
      await resend.emails.send({
        from: "RealityOS <onboarding@resend.dev>", // swap for your verified domain later
        to: user.email,
        subject,
        html,
      });

      await supabase
        .from("profiles")
        .update({ last_notified_at: new Date().toISOString() })
        .eq("id", user.id);

      results.push({ email: user.email, status: "sent" });
    } catch (err: any) {
      console.error(`Failed to email ${user.email}:`, err);
      results.push({ email: user.email, status: "failed", error: err.message });
    }
  }

  return NextResponse.json({ notified: results.length, results });
}