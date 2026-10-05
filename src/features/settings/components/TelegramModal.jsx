import { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check, ExternalLink, X, Loader2, RefreshCw } from 'lucide-react';
import { getTelegramLinkCode } from '@/api/telegram';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsTelegramModalOpen, setTelegramModalOpen } from '@/redux/slices/uiSlice';

function TelegramModalContent({ onClose }) {
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchLinkCode = async (refresh = false) => {
    setLoading(true);
    setError('');
    try {
      const res = await getTelegramLinkCode(refresh);
      setCode(res.data.code);
    } catch {
      setError('Failed to fetch connection code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initCode = async () => {
      try {
        const res = await getTelegramLinkCode(false);
        if (isMounted) setCode(res.data.code);
      } catch {
        if (isMounted) setError('Failed to fetch connection code. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initCode();
    return () => {
      isMounted = false;
    };
  }, []);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(`/link ${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'NilFinanceBot';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="artha-glass rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-900 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Connect Telegram Assistant</h3>
            <p className="text-xs text-neutral-500">Log expenses & query finances on Telegram</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-neutral-500 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Processing link code...</span>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-400 text-xs space-y-2">
            <p>{error}</p>
            <button
              onClick={() => fetchLinkCode(true)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs transition border border-white/[0.08] cursor-pointer artha-btn-interactive"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-neutral-900/80 p-4 rounded-xl border border-white/[0.065] text-center relative group">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium block mb-1">
                Your Link Code (Valid for 10 min)
              </span>
              <div className="text-2xl font-mono font-bold text-sky-400 tracking-widest my-1 flex items-center justify-center gap-2">
                <span>{code}</span>
                <button
                  onClick={() => fetchLinkCode(true)}
                  title="Regenerate new link code"
                  className="p-1 text-neutral-500 hover:text-sky-400 transition rounded-lg hover:bg-neutral-800/80 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ol className="text-xs text-neutral-400 space-y-1.5 list-decimal list-inside bg-neutral-900/60 p-3.5 rounded-xl leading-relaxed border border-white/[0.055]">
              <li>
                Open Telegram and start your ARTHA AI Bot (<strong>@{botUsername}</strong>).
              </li>
              <li>
                Send the command:{' '}
                <code className="bg-neutral-950 px-1.5 py-0.5 rounded text-sky-400 font-mono border border-white/[0.065]">
                  /link {code}
                </code>
              </li>
            </ol>

            <div className="flex gap-2 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 border border-white/[0.08] artha-btn-interactive cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Command'}
              </button>

              <a
                href={`https://t.me/${botUsername}?start=${code}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-black font-semibold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 artha-btn-interactive shadow-[0_4px_14px_rgba(56,189,248,0.22)]"
              >
                Open Bot <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TelegramModal({ isOpen: propIsOpen, onClose: propOnClose }) {
  const reduxIsOpen = useAppSelector(selectIsTelegramModalOpen);
  const dispatch = useAppDispatch();

  const isOpen = propIsOpen !== undefined ? propIsOpen : reduxIsOpen;
  const handleClose = propOnClose || (() => dispatch(setTelegramModalOpen(false)));

  if (!isOpen) return null;

  return <TelegramModalContent onClose={handleClose} />;
}
