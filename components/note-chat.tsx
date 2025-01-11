"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

interface NoteChatProps {
  noteId: number;
  noteContent: string;
}

export function NoteChat({ noteId, noteContent }: NoteChatProps) {
  const { error, messages, input, handleInputChange, handleSubmit, isLoading } =
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

  console.log(error);
  console.log(messages);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen border-l border-border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((m) => m.role !== "system")
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your note..."
            className="flex-1 px-4 py-2 rounded-md bg-muted"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
