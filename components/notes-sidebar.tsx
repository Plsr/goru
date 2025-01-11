import { getNotes } from "@/app/protected/notes/actions";
import { NotesList } from "./notes-list";

export async function NotesSidebar() {
  const notes = await getNotes();

  return (
    <div className="h-full  border-border bg-background">
      <div className="p-4">
        <h2 className="font-semibold mb-4">Notes</h2>
        <div className="space-y-1">
          {notes && <NotesList notes={notes} />}
          {!notes && <div>No notes found</div>}
        </div>
      </div>
    </div>
  );
}
