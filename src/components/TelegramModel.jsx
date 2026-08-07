import { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check, ExternalLink, X } from 'lucide-react';
import { getTelegramLinkCode } from '../services/api';

export default function TelegramModal({ isOpen, onClose }) {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchLinkCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTelegramLinkCode();
      setCode(res.data.code);
    } catch (err) {
      setError('Failed to generate connection code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLinkCode();
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(`/link ${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Connect Telegram Assistant</h3>
            <p className="text-xs text-slate-400">Log expenses and ask questions on the go</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 animate-pulse">
            Generating temporary link code...
          </div>
        ) : error ? (
          <div className="py-4 text-center text-rose-400 text-sm">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block mb-1">
                Your Link Code (Valid for 10 min)
              </span>
              <div className="text-3xl font-mono font-bold text-sky-400 tracking-widest my-2">
                {code}
              </div>
            </div>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-slate-800/40 p-3 rounded-lg leading-relaxed">
              <li>Open Telegram and start your FinPilot AI Bot.</li>
              <li>Send the command: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300 font-mono">/link {code}</code></li>
            </ol>

            <div className="flex gap-2 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Command!' : 'Copy Command'}
              </button>
              
              <a
                href={`https://t.me/FinPilotAIBot?start=${code}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                Open Bot <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}