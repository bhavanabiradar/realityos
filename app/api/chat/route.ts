import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `
You are Reality Assistant, the intelligent AI assistant inside RealityOS.

Your job is to help the user:
- organize tasks
- understand priorities
- plan their day
- summarize information
- think through decisions
- use their RealityOS workspace

Be helpful, concise, natural and friendly.

Never claim to know information that has not been provided to you.
If you do not know something, say so clearly.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    // Read request body
    const body = await request.json();

    const messages = Array.isArray(body?.messages)
      ? body.messages
      : [];

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is missing. Please add GEMINI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    // Clean and limit conversation
    const sanitizedMessages: ChatMessage[] = messages
      .filter(
        (message: any) =>
          message &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
      )
      .slice(-12)
      .map((message: any) => ({
        role:
          message.role === "assistant"
            ? "assistant"
            : "user",
        content: String(message.content).trim(),
      }));

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        {
          error: "Please provide a message.",
        },
        { status: 400 }
      );
    }

    // Create Gemini client
    const ai = new GoogleGenAI({
      apiKey,
    });

    // Convert our chat format to Gemini format
    const contents = sanitizedMessages.map((message) => ({
      role:
        message.role === "assistant"
          ? "model"
          : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

    // Ask Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const text =
      typeof response.text === "string"
        ? response.text.trim()
        : "";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Gemini returned an empty response. Please try again.",
        },
        { status: 500 }
      );
    }

    // Send response back to the frontend
    return NextResponse.json({
      text,
    });
  } catch (error: any) {
    console.error(
      "REALITYOS GEMINI ERROR:",
      error
    );

    const errorMessage =
      error?.message ||
      "I couldn't reach Gemini right now. Please try again.";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
