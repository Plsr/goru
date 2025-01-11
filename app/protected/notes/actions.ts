"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_date", { ascending: false });

  return notes;
}

export async function createNote() {
  console.log("Creating note");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: "New Note",
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
