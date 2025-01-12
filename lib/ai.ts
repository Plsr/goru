import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export const taskSuggestionsSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      impact: z.string().optional(),
    })
  ),
  feedback: z.string(),
});

export const analyzeDaySchema = z.object({
  analysis: z.array(
    z.object({
      logEntryReference: z.string(),
      feedback: z.string().optional(),
      suggestions: z.string().optional(),
      openQuestions: z.string().optional(),
    })
  ),
});

export const objectPayload = z.object({
  type: z.enum(["CREATE_TASKS"]),
  object: taskSuggestionsSchema,
});

export type TaskSuggestions = z.infer<typeof taskSuggestionsSchema>;

export const chat = async (message: string) => {
  return await generateText({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: openai("gpt-4o"),
  });
};
