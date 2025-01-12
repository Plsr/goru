"use client";

import { NoteWithTasks, Task } from "@/utils/supabase/types";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { updateNote } from "@/app/protected/notes/actions";

interface NoteFormData {
  title: string;
  content: string;
  tasks: Task[];
}

export function NoteForm({ note }: { note: NoteWithTasks }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<NoteFormData>({
    defaultValues: {
      title: note.title,
      content: note.content || "",
    },
  });

  async function onSubmit(formData: NoteFormData) {
    startTransition(async () => {
      try {
        await updateNote(note.id, formData);
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full w-full flex flex-col"
    >
      <input
        {...register("title")}
        type="text"
        placeholder="Note title"
        className="w-full px-4 py-2 text-xl font-bold bg-transparent"
      />
      <textarea
        {...register("content")}
        placeholder="Write your note content here..."
        className="flex-1  w-full px-4 py-2 bg-transparent resize-none"
      />

      <button
        type="submit"
        disabled={isPending}
        className=" bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
