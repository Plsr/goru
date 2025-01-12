"use client";

import { NoteWithTasks } from "@/utils/supabase/types";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { updateNote } from "@/app/protected/notes/actions";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { formatDistanceToNow } from "date-fns";

interface NoteFormData {
  title: string;
  content: string;
}

export function NoteForm({ note }: { note: NoteWithTasks }) {
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState(note.updated_at);
  const { register, getValues } = useForm<NoteFormData>({
    defaultValues: {
      title: note.title,
      content: note.content || "",
    },
  });

  const saveNote = useDebouncedCallback(
    (data: NoteFormData) => {
      startTransition(async () => {
        try {
          await updateNote(note.id, data);
          setLastSaved(new Date().toISOString());
        } catch (error) {
          console.error("Failed to save note:", error);
        }
      });
    },
    2000 // 2 second debounce
  );

  const handleChange = useCallback(() => {
    const data = getValues();
    saveNote(data);
  }, [getValues, saveNote]);

  return (
    <div className="h-full w-full flex flex-col">
      <input
        {...register("title", {
          onChange: handleChange,
        })}
        type="text"
        placeholder="Note title"
        className="w-full px-4 py-2 text-xl font-bold bg-transparent"
      />
      <textarea
        {...register("content", {
          onChange: handleChange,
        })}
        placeholder="Write your note content here..."
        className="flex-1 w-full px-4 py-2 bg-transparent resize-none focus:outline-none"
      />

      {isPending && (
        <div className="text-xs text-muted-foreground px-4 py-1">Saving...</div>
      )}
      {!isPending && (
        <div className="text-xs text-muted-foreground px-4 py-1">
          Last saved {formatDistanceToNow(lastSaved)} ago
        </div>
      )}
    </div>
  );
}
