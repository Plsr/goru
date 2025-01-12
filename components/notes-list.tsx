"use client";

import { Note } from "@/utils/supabase/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { FastLink } from "./fast-link";

export const NotesList = ({ notes }: { notes: Note[] }) => {
  const pathname = usePathname();
  const currentNoteId =
    pathname.split("/").pop() === "notes" ? null : pathname.split("/").pop();
  const currentNoteIdNumber = currentNoteId ? parseInt(currentNoteId) : null;

  console.log(notes);
  return (
    <>
      {notes.map((note) => (
        <FastLink
          key={note.id}
          href={`/protected/notes/${note.id}`}
          className={cn(
            "block w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
            currentNoteIdNumber &&
              currentNoteIdNumber === note.id &&
              "bg-accent text-accent-foreground"
          )}
        >
          <div className="text-sm font-medium truncate">{note.title}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(note.created_date), "MMM d, yyyy")}
          </div>
        </FastLink>
      ))}
    </>
  );
};
