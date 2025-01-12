"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { analyzeDaySchema, taskSuggestionsSchema } from "@/lib/ai";
import { Task } from "@/utils/supabase/types";
import { format } from "date-fns";

export async function getNotes() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_date", { ascending: false });

  return notes;
}

export async function createNote() {
  const supabase = await createClient();

  const defaultTitle = format(new Date(), "EEEE, MMM dd yyyy");

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: defaultTitle,
    })
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    return;
  }

  redirect(`/protected/notes/${data.id}`);
}

export async function updateNote(
  noteId: number,
  data: { title: string; content: string }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .update({
      title: data.title,
      content: data.content,
    })
    .match({ id: noteId });

  if (error) {
    throw error;
  }

  revalidatePath(`/protected/notes/${noteId}`);
  revalidatePath("/protected/notes"); // Revalidate the list view as well
}

export async function createGoal(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("goals").insert({
    name: formData.get("name") as string,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/protected/notes");
}

export async function getGoals() {
  const supabase = await createClient();
  const { data: goals, error } = await supabase.from("goals").select("*");

  if (error || !goals) {
    console.error(error);
    return [];
  }

  return goals;
}

export async function generateTasks(noteId: number) {
  const goals = await getGoals();
  const note = await getNotes();
  const noteContent = note?.find((n) => n.id === noteId)?.content;

  const systemPrompt = `You are an empathetic and insightful coach analyzing journal entries. Your role is to provide thoughtful feedback by connecting the user's daily activities to their defined goals. The user's current goals are: ${goals
    ?.map((g) => g.name)
    .join(
      ", "
    )}. Offer constructive observations about their progress, celebrate their wins, and gently explore areas for improvement. When appropriate, ask clarifying questions to better understand how certain activities relate to their goals or to help them reflect on missed opportunities. Maintain an encouraging and motivational tone while being honest and direct in your feedback. Help them stay accountable to their goals while being understanding of life's challenges. Here is what the user did today: ${noteContent}`;

  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: taskSuggestionsSchema,
    system: systemPrompt,
    prompt: `Create 3-5 actionable tasks that will help the user progress towards their goals. Each task should be specific, measurable, and achievable within a day. Include a brief description of the task and its potential impact.`,
  });

  console.log(result.object.tasks);

  return result.object.tasks;
}

export async function analyzeDay(noteId: number) {
  console.log("Analyzing day");
  const goals = await getGoals();
  const note = await getNotes();
  const noteContent = note?.find((n) => n.id === noteId)?.content;
  const systemPrompt = `You are an empathetic and insightful coach analyzing journal entries. Your role is to provide thoughtful feedback by connecting the user's daily activities to their defined goals. The user's current goals are: ${goals
    ?.map((g) => g.name)
    .join(
      ", "
    )}. Offer constructive observations about their progress, celebrate their wins, and gently explore areas for improvement. When appropriate, ask clarifying questions to better understand how certain activities relate to their goals or to help them reflect on missed opportunities. Maintain an encouraging and motivational tone while being honest and direct in your feedback. Help them stay accountable to their goals while being understanding of life's challenges. Here is what the user did today: ${noteContent}`;

  const result = await generateObject({
    model: openai("gpt-4o"),
    schema: analyzeDaySchema,
    system: systemPrompt,
    prompt: `Analyze the notes and tasks for the day. Provide feedback on the tasks and log entries, suggest improvements, and ask clarifying questions.`,
  });

  return result.object;
}

export const AddTask = async (noteId: number, task: Task) => {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    note_id: noteId,
    title: task.title,
    description: task.description,
  });

  if (error) {
    console.error(error);
    return false;
  }

  revalidatePath(`/protected/notes/${noteId}`);

  return true;
};
