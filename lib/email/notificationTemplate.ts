interface PendingTask {
  title: string;
}

interface PendingEvent {
  title: string;
  time: string;
}

interface PendingDecision {
  title: string;
}

interface NotificationData {
  fullName: string;
  daysInactive: number;
  tasks: PendingTask[];
  events: PendingEvent[];
  decisions: PendingDecision[];
}

export function buildNotificationEmail(data: NotificationData) {
  const { fullName, daysInactive, tasks, events, decisions } = data;
  const name = fullName?.trim() || "there";

  const taskList = tasks.length
    ? tasks.map((t) => `<li>${escapeHtml(t.title)}</li>`).join("")
    : `<li style="color:#888;">No pending tasks</li>`;

  const eventList = events.length
    ? events
        .map((e) => `<li>${escapeHtml(e.title)} — ${escapeHtml(e.time)}</li>`)
        .join("")
    : `<li style="color:#888;">No upcoming events</li>`;

  const decisionList = decisions.length
    ? decisions.map((d) => `<li>${escapeHtml(d.title)}</li>`).join("")
    : `<li style="color:#888;">No pending decisions</li>`;

  const subject = `You're missing out on your RealityOS streak, ${name}!`;

  const html = `
  <div style="font-family: -apple-system, sans-serif; background:#0a0b0e; color:#e5e5e5; padding:32px; border-radius:16px; max-width:520px; margin:auto;">
    <h1 style="color:#22d3ee; font-size:20px;">Hey ${escapeHtml(name)} 👋</h1>
    <p style="font-size:14px; line-height:1.6; color:#c4c4c4;">
      You haven't opened RealityOS in <strong>${daysInactive} days</strong> — you're missing out on your streak!
      Here's what's waiting for you:
    </p>

    <h3 style="color:#fff; font-size:13px; margin-top:24px;">✅ Today's Priorities</h3>
    <ul style="font-size:13px; color:#c4c4c4; padding-left:18px;">${taskList}</ul>

    <h3 style="color:#fff; font-size:13px; margin-top:20px;">📅 Planner</h3>
    <ul style="font-size:13px; color:#c4c4c4; padding-left:18px;">${eventList}</ul>

    <h3 style="color:#fff; font-size:13px; margin-top:20px;">⚖️ Decisions</h3>
    <ul style="font-size:13px; color:#c4c4c4; padding-left:18px;">${decisionList}</ul>

    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
       style="display:inline-block; margin-top:24px; padding:10px 20px; background:linear-gradient(90deg,#22d3ee,#3b82f6); color:#000; font-weight:bold; font-size:13px; border-radius:10px; text-decoration:none;">
      Open RealityOS →
    </a>
  </div>`;

  return { subject, html };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}