import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { messages, workspace, attachment } = await req.json();

    const systemPrompt = `You are Reality Assistant, the intelligent workspace AI for RealityOS.
You have real-time access to the user's active workspace state:
- Registered Tasks & Priorities: ${JSON.stringify(workspace?.tasks || [])}
- Registered Schedule & Events: ${JSON.stringify(workspace?.events || [])}
- Uploaded Documents in Library: ${JSON.stringify(workspace?.documents || [])}
- Decisions: ${JSON.stringify(workspace?.decisions || [])}

When answering:
1. Provide fast, direct, concise, and structured answers.
2. If the user asks about uploaded documents, verify the name and contents against the library or the attached file.
3. If an image or document is attached in the message, prioritize analyzing its text or visual content.`;

    const contents: any[] = [{ role: "user", parts: [{ text: systemPrompt }] }];

    messages.forEach((msg: any) => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    });

    // If an image was attached to current prompt
    if (attachment && attachment.base64 && attachment.mimeType) {
      contents[contents.length - 1].parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.base64.split(",")[1] || attachment.base64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}