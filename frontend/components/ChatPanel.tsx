'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type ChatPanelProps = {
  onHighlightProject?: (projectId: string) => void;
};

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export const ChatPanel = ({ onHighlightProject }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'agent',
      content:
        'Hi! Upload a resume PDF first, then ask me anything about the candidate.',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ------------------------------
  // SEND CHAT MESSAGE
  // ------------------------------
  const handleSend = async () => {
    if (!input.trim() || isTyping || !BACKEND_URL) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: data.response || 'No response generated.',
          timestamp: new Date(),
        },
      ]);

      // Optional project highlight hook (safe)
      if (data.projectId) {
        onHighlightProject?.(data.projectId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error',
          role: 'agent',
          content: '❌ Failed to reach the agent.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ------------------------------
  // PDF RESUME UPLOAD
  // ------------------------------
  const handlePDFUpload = async (file: File) => {
    if (!BACKEND_URL) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF resumes are supported.');
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: `📄 Uploaded resume: ${file.name}`,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/resume/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: data.summary || 'Resume uploaded successfully.',
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: '⚠️ Resume upload failed.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border bg-card">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-muted'
                }`}
              >
                {msg.role === 'agent' ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-center gap-2 text-sm opacity-70">
            <Loader2 className="w-4 h-4 animate-spin" />
            Agent is thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="file"
          accept="application/pdf"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePDFUpload(file);
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg border"
          title="Upload PDF resume"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about skills, projects, experience..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isTyping}
        />

        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
