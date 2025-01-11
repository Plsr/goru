import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are an empathetic and insightful coach analyzing journal entries. Your role is to provide thoughtful feedback by connecting the user's daily activities to their defined goals. Offer constructive observations about their progress, celebrate their wins, and gently explore areas for improvement. When appropriate, ask clarifying questions to better understand how certain activities relate to their goals or to help them reflect on missed opportunities. Maintain an encouraging and motivational tone while being honest and direct in your feedback. Help them stay accountable to their goals while being understanding of life's challenges.",
    messages,
  });

  return result.toDataStreamResponse();
}
