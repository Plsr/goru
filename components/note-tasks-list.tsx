import { Task } from "@/utils/supabase/types";

export const NoteTasksList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <>
      <h2 className="text-lg font-bold">Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <p className="font-bold">{task.title}</p>
          <p className="text-sm opacity-50">{task.description}</p>
        </div>
      ))}
    </>
  );
};
