'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import axiosInstance from '../../../lib/axios';
import { toggleAiPanel } from '../../../redux/slices/ui.slice';


interface Message { role: 'user' | 'assistant'; content: string; }

export function AiPanel() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.aiPanelOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/ai/chat', { message: input });
      const reply = res.data.data ?? res.data;
      setMessages((prev) => [...prev, { role: 'assistant', content: typeof reply === 'string' ? reply : JSON.stringify(reply) }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-[#0D1117] border-l border-white/5 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
            </div>
            <button onClick={() => dispatch(toggleAiPanel())} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">✨</div>
                <p className="text-slate-400 text-sm font-medium">How can I help?</p>
                <p className="text-slate-600 text-xs mt-1">Ask me to summarize docs, generate subtasks, or anything else.</p>
                <div className="mt-4 space-y-2">
                  {[
                    'Summarize this project',
                    'Generate subtasks for user authentication',
                    'Write a project brief',
                  ].map((s) => (
                    <button key={s} onClick={() => setInput(s)}
                      className="block w-full text-left text-xs text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-300 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-3 py-2.5 rounded-xl rounded-bl-sm">
                  <Loader2 size={14} className="text-slate-500 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 bg-slate-800 border border-white/5 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <button onClick={send} disabled={!input.trim() || loading}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-lg text-white transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}