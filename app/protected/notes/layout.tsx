import { NotesSidebar } from "@/components/notes-sidebar";
import { GoalsSection } from "@/components/goals-section";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Card, CardContent } from "@/components/ui/card";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-4 h-screen ">
      <div className="col-span-3 h-full flex flex-col">
        <div className="flex-1 p-4">
          <NotesSidebar />
        </div>
        <div className="flex-0 p-4">
          <GoalsSection />
        </div>
      </div>
      <div className="col-span-9 py-4 max-h-screen">{children}</div>
      <ModalProvider />
    </div>
  );
}
