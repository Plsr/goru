"use client";

import { createNote } from "@/app/protected/notes/actions";
import { Button } from "@/components/ui/button";
import { NotebookPen } from "lucide-react";

export const NewNoteButton = () => {
  const handleClick = () => {
    createNote();
  };

  return (
    <Button onClick={handleClick} variant="outline" className="w-full mb-6">
      <NotebookPen className="w-4 h-4 mr-2" />
      New Note
    </Button>
  );
};
