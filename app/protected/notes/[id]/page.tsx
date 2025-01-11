import { createClient } from "@/utils/supabase/server";
import { NoteForm } from "@/components/note-form";
import { NoteChat } from "@/components/note-chat";

export default async function NotePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .match({ id: params.id })
    .single();

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-6 h-full">
        <NoteForm note={note} />
      </div>
      <div className="col-span-6 h-full">
        <NoteChat noteId={note.id} noteContent={note.content || ""} />
      </div>
    </div>
  );
}
