import { getNotes } from "@/app/protected/notes/actions";
import { NotesList } from "./notes-list";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { NotebookPen, NotepadText, Plus } from "lucide-react";
import { Button } from "./ui/button";

export async function NotesSidebar() {
  const notes = await getNotes();

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <NotepadText className="w-4 h-4 mr-2" /> Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-full  border-border bg-background">
          <Button variant="outline" className="w-full mb-6">
            <NotebookPen className="w-4 h-4 mr-2" />
            New Note
          </Button>
          <div className="space-y-1">
            {notes && <NotesList notes={notes} />}
            {!notes && <div>No notes found</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
