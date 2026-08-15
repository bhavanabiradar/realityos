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

You have access to the user's current RealityOS workspace data when it is provided below.

Use that workspace data to answer questions about:
- tasks
- priorities
- completed and incomplete tasks
- upcoming events
- decisions

IMPORTANT:
- Use the provided RealityOS data when answering workspace questions.
- Never invent tasks, events, decisions, or schedule information.
- If the requested information is not present in the workspace data, say that clearly.
- Be helpful, concise, natural and friendly.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type WorkspaceContext = {
  tasks?: unknown[];
  events?: unknown[];
  decisions?: unknown[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const workspace: WorkspaceContext =
      body?.workspace ?? {};

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

    const workspaceContext = `
CURRENT REALITYOS WORKSPACE DATA:

TASKS:
${JSON.stringify(workspace.tasks ?? [], null, 2)}

EVENTS:
${JSON.stringify(workspace.events ?? [], null, 2)}

DECISIONS:
${JSON.stringify(workspace.decisions ?? [], null, 2)}
`;

    const ai = new GoogleGenAI({
      apiKey,
    });

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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction:
          SYSTEM_INSTRUCTION + "\n\n" + workspaceContext,
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