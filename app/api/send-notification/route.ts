// app/api/send-notification/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, streak } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email payload configuration
    // Note: You can plug in Resend, Nodemailer, or Supabase SMTP here
    const notificationContent = {
      to: email,
      subject: "🔥 RealityOS Alert: Your Streak & Priorities are waiting!",
      body: `Hey there!\n\nWe noticed you haven't opened RealityOS in a couple of days. Your current streak is at risk (${streak} days)!\n\nYour Today's Priorities, Planner, and Decisions are waiting for you in your workspace.\n\nJump back in to keep your momentum going: https://realityos-nrlk.vercel.app`,
    };

    // Simulate dispatch success (Integrate your mail provider SDK here, e.g., Resend)
    console.log("Sending email notification to:", notificationContent.to);

    return NextResponse.json({ success: true, message: "Notification email dispatched successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}