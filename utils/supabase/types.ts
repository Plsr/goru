import { Database } from "@/database.types";

export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type NoteWithTasks = Note & { tasks: Task[] };
