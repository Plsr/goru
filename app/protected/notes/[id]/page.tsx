import { createClient } from "@/utils/supabase/server";
import { NoteForm } from "@/components/note-form";
import { NoteChat } from "@/components/note-chat";
import { NoteWithTasks, Task } from "@/utils/supabase/types";
import { NoteTasksList } from "@/components/note-tasks-list";
import { Card } from "@/components/ui/card";

export default async function NotePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: note } = await supabase
    .from("notes")
    .select("*, tasks(title, description)")
    .match({ id: params.id })
    .single();

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <Card className="h-full">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-7 h-full flex">
          <div className="flex flex-col w-full h-full">
            <div className="row-span-8 flex-1 p-4">
              <NoteForm note={note as NoteWithTasks} />
            </div>
            <div className="row-span-4 flex flex-0 flex-col gap-2 overflow-y-auto  p-4">
              <NoteTasksList tasks={note.tasks as Task[]} />
            </div>
          </div>
        </div>
        <div className="col-span-5 dark:bg-neutral-900 bg-gray-50 overflow-y-auto">
          <NoteChat noteId={note.id} noteContent={note.content || ""} />
        </div>
      </div>
    </Card>
  );
}
