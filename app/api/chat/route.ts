import { getGoals } from "@/app/protected/notes/actions";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { analyzeDaySchema, taskSuggestionsSchema } from "@/lib/ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  console.log(messages, id);
  const goals = await getGoals();

  const systemPrompt = `You are an empathetic and insightful coach analyzing journal entries. Your role is to provide thoughtful feedback by connecting the user's daily activities to their defined goals. The user's current goals are: ${goals
    ?.map((g) => g.name)
    .join(
      ", "
    )}. Offer constructive observations about their progress, celebrate their wins, and gently explore areas for improvement. When appropriate, ask clarifying questions to better understand how certain activities relate to their goals or to help them reflect on missed opportunities. Maintain an encouraging and motivational tone while being honest and direct in your feedback. Help them stay accountable to their goals while being understanding of life's challenges.`;

  // Handle object generation for tasks
  if (id === "CREATE_TASKS") {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: taskSuggestionsSchema,
      system: systemPrompt,
      messages,
      prompt: `Create 3-5 actionable tasks that will help the user progress towards their goals. Each task should be specific, measurable, and achievable within a day. Include a brief description of the task and its potential impact.`,
    });

    return NextResponse.json(result);
  }

  if (id === "ANALYZE_DAY") {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: analyzeDaySchema,
      system: systemPrompt,
      messages,
      prompt: `Analyze the notes and tasks for the day. Provide feedback on the tasks and log entries, suggest improvements, and ask clarifying questions.`,
    });

    return NextResponse.json(result);
  }

  // Handle regular chat messages
  // const result = streamText({
  //   model: openai("gpt-4o"),
  //   system: systemPrompt,
  //   messages,
  // });

  // return result.toDataStreamResponse();
}
