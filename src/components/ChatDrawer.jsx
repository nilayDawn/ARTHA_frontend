import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAgent } from '../services/api';

export default function ChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Finance Assistant. Ask me anything about your spending, savings goals, or budgets!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');

    // Reconstruct history for backend payload format
    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const data = await chatWithAgent(userMsg, historyPayload);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          memories: data.memories_used || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">FinPilot Assistant</h3>
                <p className="text-xs text-slate-400">Powered by LangGraph & Gemini 2.5</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.memories && msg.memories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                      💡 Context recalled: {msg.memories.join(', ')}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3 text-slate-400 text-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-400" />
                  <span>FinPilot is analyzing your financial context...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1.5 focus-within:border-emerald-500/50 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about spending, goals, or budgets..."
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}