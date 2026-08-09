import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are Reality Assistant, the intelligent assistant inside RealityOS.
You help the user organize information, understand their priorities, plan tasks,
summarize information, reason through decisions and use their digital workspace effectively.
Be concise, helpful and natural.
Never pretend to have access to information that RealityOS has not provided.
When information is missing, ask the user for it.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getAssistantText(response: any) {
  if (typeof response?.text === "string" && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.flatMap((candidate: any) =>
    candidate?.content?.parts?.map((part: any) => part?.text).filter(Boolean) ?? [],
  );

  if (Array.isArray(parts) && parts.length > 0) {
    return parts.join("\n").trim();
  }

  return "I’m here to help. Please try a different prompt.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini is not configured yet. Add GEMINI_API_KEY to your environment to enable the assistant.",
        },
        { status: 500 },
      );
    }

    const sanitizedMessages = messages
      .filter((message: any) => message && typeof message.content === "string" && message.content.trim())
      .slice(-12)
      .map((message: any) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content).trim(),
      })) as ChatMessage[];

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Please provide a message to the assistant." },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: sanitizedMessages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const text = getAssistantText(response);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini chat request failed:", error);

    return NextResponse.json(
      {
        error: "I couldn’t reach Gemini right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
