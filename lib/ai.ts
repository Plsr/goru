import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

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
