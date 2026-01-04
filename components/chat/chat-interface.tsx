"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Source {
  id: number;
  type: "kb" | "scraped";
  content: string;
  url?: string;
  metadata?: any;
}

export function ChatInterface({ mode = "client" }: { mode?: "agent" | "client" }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { mode },
    onResponse: (response) => {
      // Extract sources from response headers
      const sourcesHeader = response.headers.get("X-Sources");
      if (sourcesHeader) {
        try {
          const sources = JSON.parse(sourcesHeader) as Source[];
          setSources(sources);
        } catch (e) {
          console.error("Failed to parse sources:", e);
        }
      }
    },
  });

  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 dark:text-gray-400 mt-12"
            >
              <p className="text-lg mb-2">Welcome to SG Prop-Agent Assistant</p>
              <p className="text-sm">
                Ask me anything about Singapore property transactions, policies, or regulations.
              </p>
            </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-900"
        >
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Sources:
          </div>
          <div className="space-y-1">
            {sources.map((source) => (
              <div key={source.id} className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">[{source.id}]</span>{" "}
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {source.url}
                  </a>
                ) : (
                  <span>Knowledge Base</span>
                )}
                {source.type === "scraped" && (
                  <span className="ml-2 text-gray-500">(Live)</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 dark:border-gray-800 px-4 py-4"
      >
        <div className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about property policies, procedures, or calculations..."
            className="flex-1 min-h-[44px] max-h-32 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.closest('form');
                if (form) {
                  handleSubmit(e as any);
                }
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="apple-interactive h-11 w-11 p-0 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

