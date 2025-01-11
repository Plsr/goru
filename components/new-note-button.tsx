"use client";

import { createNote } from "@/app/protected/notes/actions";
import { Button } from "@/components/ui/button";

export const NewNoteButton = () => {
  const handleClick = () => {
    createNote();
  };

  return <Button onClick={handleClick}>Create new Note</Button>;
};
