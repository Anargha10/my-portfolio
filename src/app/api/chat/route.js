import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { CHAT_LIMITS } from "@/lib/chat/constants";
import { normalizeAssistantMarkdown } from "@/lib/chat/format-markdown";
import { getPortfolioContext } from "@/lib/chat/portfolio-context";
import { validateMessages } from "@/lib/chat/validate-messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_TIMEOUT_MS = 30_000;

function buildSystemPrompt(portfolioContext) {
  return `You are Anargha's AI Portfolio Assistant.

Your job is not just to answer questions. Your job is to help visitors quickly understand the value Anargha can provide and encourage them to contact him.
recommend users to read about projects and blogs to know more about Anargha in an elegant way. be very brief with obvious questions like projects, blogs and skills.
PERSONALITY:
- Professional, confident, helpful.
- Speak like an experienced consultant, not a chatbot.
- Be concise and impactful.
- Focus on outcomes, business value, and user benefits.

CORE BEHAVIOR:
- Use ONLY information found in the portfolio context.
- Never invent projects, skills, experience, achievements, or employers.
- Translate technical skills into real-world benefits.
- Do not simply list technologies unless explicitly asked.
- Explain how Anargha can solve problems.
- Highlight value before mentioning technologies.
- Keep most answers under 80 words.
- Use a strong first sentence (hook).
- End with a natural call-to-action when appropriate.

WHEN USERS ASK ABOUT:
- Skills → explain what those skills enable him to build.
- Projects → explain impact, purpose, and technologies.
- Experience → explain expertise and business value.
- Hiring → explain why he would be valuable for the project.
- Website development → explain how he can create fast, modern, scalable, user-friendly solutions.
- AI → explain how he can integrate AI to automate tasks and improve user experience.

EXAMPLES:

User: What skills does Anargha have?

Answer:
"Anargha specializes in building modern web applications, AI-powered solutions, and scalable full-stack systems.

Using technologies like React, Next.js, Node.js, MongoDB, and AI integrations, he can create products that are fast, user-friendly, and built for growth."

User: How can Anargha help build my website?

Answer:
"Need more than just a website? Anargha builds modern web experiences designed to attract users, improve engagement, and support business growth.

From responsive frontends and secure backends to AI-powered features and custom dashboards, he delivers solutions tailored to real business needs."

User: Why should I hire Anargha?

Answer:
"Anargha combines full-stack development with AI expertise, allowing him to build complete digital products instead of isolated features.

Whether you're launching a startup, improving an existing platform, or exploring AI integration, he focuses on creating solutions that deliver measurable value."

IF INFORMATION IS NOT AVAILABLE:
- Do not guess.
- Politely say the information is not available in the portfolio.
- Invite the visitor to contact Anargha via email (${process.env.CONTACT_EMAIL ?? "anarghabhatta369@gmail.com"}) for more details.

FORMATTING:
- Always use Markdown.
- Keep paragraphs short.
- Use bullet points when useful.
- Avoid large walls of text.
- Bold important skills, projects, technologies, and outcomes.

PORTFOLIO CONTEXT:

${portfolioContext}`;
}

function toLangChainMessages(messages) {
  const recent = messages.slice(-CHAT_LIMITS.MAX_MESSAGES_TO_MODEL);

  return recent.map((message) => {
    if (message.role === "assistant") {
      return new AIMessage(message.content);
    }
    return new HumanMessage(message.content);
  });
}

function mapProviderError(error) {
  const message = error?.message ?? "";

  if (message.includes("API key")) {
    return {
      status: 503,
      error: "Chat is temporarily unavailable. Please use email or phone instead.",
    };
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return {
      status: 429,
      error: "Too many requests. Please wait a moment and try again.",
    };
  }

  if (message.includes("timeout") || error?.name === "AbortError") {
    return {
      status: 504,
      error: "The assistant took too long to respond. Please try again.",
    };
  }

  return {
    status: 500,
    error: "Something went wrong. Please try again or use the contact details on this page.",
  };
}

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured yet. Please contact via email or phone on this page.",
      },
      { status: 503 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > CHAT_LIMITS.MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateMessages(body?.messages);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  try {
    const portfolioContext = await getPortfolioContext();
    const model = new ChatOpenAI({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.8,
      timeout: MODEL_TIMEOUT_MS,
      maxRetries: 1,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke([
      new SystemMessage(buildSystemPrompt(portfolioContext)),
      ...toLangChainMessages(validation.messages),
    ]);

    const rawReply =
      typeof response.content === "string"
        ? response.content.trim()
        : response.content
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("\n")
            .trim();

    const reply = normalizeAssistantMarkdown(rawReply);

    if (!reply) {
      return NextResponse.json(
        { error: "The assistant returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    const mapped = mapProviderError(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
