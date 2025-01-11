import { NotesSidebar } from "@/components/notes-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-3 border-r">
        <NotesSidebar />
      </div>
      <div className="col-span-9 h-full">{children}</div>
    </div>
  );
}
