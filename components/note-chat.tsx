"use client";

import { useChat, experimental_useObject as useObject } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { TaskSuggestions, taskSuggestionsSchema } from "@/lib/ai";
import {
  AddTask,
  analyzeDay,
  generateTasks,
} from "@/app/protected/notes/actions";
import { Task } from "@/utils/supabase/types";

interface NoteChatProps {
  noteId: number;
  noteContent: string;
}

const PROMPTS = {
  CREATE_TASKS: "Create tasks based on my note and goals",
  ANALYZE_DAY: "Analyze my day",
} as const;

export function NoteChat({ noteId, noteContent }: NoteChatProps) {
  const [taskSuggestions, setTaskSuggestions] = useState<
    TaskSuggestions["tasks"] | null
  >(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "system",
          role: "system",
          content: `You are a helpful AI assistant discussing the following note: "${noteContent}"`,
        },
      ],
    });

  const handleObjectSubmit = async (type: string) => {
    console.log(type);
    if (type === "CREATE_TASKS") {
      setIsLoadingTasks(true);
      const tasks = await generateTasks(noteId);
      if (!tasks) {
        setIsLoadingTasks(false);
        return;
      }

      setTaskSuggestions(tasks);
      setIsLoadingTasks(false);
    }
    if (type === "ANALYZE_DAY") {
      setIsLoadingTasks(true);
      const analysis = await analyzeDay(noteId);
      setIsLoadingTasks(false);
      setAnalysis(analysis);
    }
  };

  const handleAddTaskClick = async (task: Task) => {
    console.log(task);
    const success = await AddTask(noteId, task);
    if (success) {
      console.log("Task added successfully");
    } else {
      console.log("Failed to add task");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {taskSuggestions && (
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Suggested Tasks</h3>
            <div className="space-y-2">
              {taskSuggestions?.map((task: any, index: any) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground">
                      {task.description}
                    </div>
                  )}
                  {task.impact && (
                    <div className="text-sm text-muted-foreground">
                      Impact: {task.impact}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTaskClick(task)}
                  >
                    Add tasks
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis && (
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Analysis</h3>
            <div className="space-y-2">
              {analysis.analysis.map((a: any) => (
                <div key={a.id}>
                  <div>{a.feedback}</div>
                  <div>{a.suggestions}</div>
                  <div>{a.openQuestions}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 mb-auto">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="rounded-full text-xs"
            size="sm"
            onClick={() => handleObjectSubmit("CREATE_TASKS")}
            disabled={isLoadingTasks}
          >
            {isLoadingTasks ? "Creating Tasks..." : "Create Tasks"}
          </Button>
          <Button
            variant="secondary"
            className="rounded-full text-xs"
            size="sm"
            onClick={() => handleObjectSubmit("ANALYZE_DAY")}
            disabled={isLoadingTasks}
          >
            {isLoadingTasks ? "Analyzing Day..." : "Analyze Day"}
          </Button>
        </div>
      </div>
    </div>
  );
}
