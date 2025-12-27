"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Sparkles, User, Bot, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I'm your sanctuary companion. How are you feeling today? I'm here to listen and support you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Prepare history for Gemini - Role must be 'user' or 'model'
      // CRITICAL: Gemini requires the first message to be from the 'user'
      let history = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      // Find the index of the first 'user' message to satisfy Gemini requirements
      const firstUserIndex = history.findIndex(h => h.role === "user");
      if (firstUserIndex !== -1) {
        history = history.slice(firstUserIndex);
      } else {
        history = []; // If no user messages yet, start fresh
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, history }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.text,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "I'm sorry, I'm having trouble connecting right now. " + (error.message.includes("API key") ? "Please make sure the Gemini API key is configured." : "Please try again later."),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#07040e] text-white flex flex-col relative overflow-hidden">
      {/* 🌌 ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#07040e]/80 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                Personal Space
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Your private AI companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Online</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-emerald-600"}`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-[1.5rem] shadow-xl ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none" 
                      : "bg-white/[0.05] backdrop-blur-md border border-white/10 text-gray-200 rounded-tl-none"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 p-4 rounded-[1.5rem] rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#07040e] via-[#07040e] to-transparent pointer-events-none z-50">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-6 py-2 outline-none text-sm font-medium placeholder-gray-500 text-white"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-emerald-500/20"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[9px] text-gray-600 mt-3 uppercase tracking-[0.2em] font-bold">
            Sanctuary AI is here for support, but not a replacement for professional help.
          </p>
        </div>
      </div>
    </div>
  );
}
