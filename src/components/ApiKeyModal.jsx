import { useState, useEffect } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Loader2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { validateApiKey } from '../services/api';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('user_artha_api_key') || localStorage.getItem('user_gemini_api_key') || '';
      setActiveKey(stored);
      setApiKey(stored);
      setNotification(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setNotification({ type: 'error', text: 'Please enter an API key to test.' });
      return;
    }

    try {
      setTesting(true);
      setNotification(null);
      const res = await validateApiKey(apiKey.trim());
      if (res.data?.valid) {
        setNotification({ type: 'success', text: res.data.message || 'API key validated successfully!' });
      } else {
        setNotification({ type: 'error', text: res.data?.message || 'Invalid API key provided.' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to validate API key with servers.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setNotification({ type: 'error', text: 'Please enter a valid API key before saving.' });
      return;
    }

    try {
      setSaving(true);
      setNotification(null);
      const res = await validateApiKey(apiKey.trim());
      if (res.data?.valid) {
        localStorage.setItem('user_artha_api_key', apiKey.trim());
        setActiveKey(apiKey.trim());
        setNotification({ type: 'success', text: 'Custom API Key saved! ARTHA will now prioritize your key.' });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setNotification({ type: 'error', text: res.data?.message || 'Could not save key: Validation failed.' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to validate and save key.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('user_artha_api_key');
    localStorage.removeItem('user_gemini_api_key');
    setActiveKey('');
    setApiKey('');
    setNotification({ type: 'info', text: 'Custom API key removed. Reverted to server default keys.' });
  };

  const getMaskedKey = (keyStr) => {
    if (!keyStr) return '';
    if (keyStr.length <= 8) return '••••••••';
    return `${keyStr.substring(0, 6)}••••••••${keyStr.substring(keyStr.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-900 rounded-2xl p-6 text-neutral-100 shadow-2xl relative overflow-hidden">
        {/* Glowing Top Subtle Ambient Gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D6A84F]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-[#D6A84F] flex items-center justify-center shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                ARTHA API Key Settings
              </h3>
              <p className="text-xs text-neutral-400">Configure custom ARTHA API Key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Key Status Card */}
        <div className="my-4 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${activeKey ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`}></div>
            <div>
              <span className="font-medium text-neutral-300">
                {activeKey ? 'Custom API Key Active' : 'Default System Keys Active'}
              </span>
              {activeKey && (
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  {getMaskedKey(activeKey)}
                </p>
              )}
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
            activeKey
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
          }`}>
            {activeKey ? 'Custom User Quota' : 'System Shared Quota'}
          </span>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>ARTHA API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#D6A84F] hover:underline flex items-center gap-1 text-[11px]"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-[#D6A84F]/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 font-mono focus:outline-none transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Feedback Message */}
          {notification && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                notification.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : notification.type === 'info'
                  ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                  : 'bg-red-950/40 border-red-800/60 text-red-300'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : notification.type === 'info' ? (
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{notification.text}</span>
            </div>
          )}

          {/* Key Info Banner */}
          <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-900 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>Prioritized Intelligent Fallback</span>
            </div>
            <p className="leading-normal">
              When set, ARTHA will route all reasoning, security guardrails, receipt OCR, and vector embeddings through your API key first. If your key runs out of quota or fails, it automatically falls back to system keys.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {activeKey ? (
              <button
                type="button"
                onClick={handleClearKey}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Custom Key
              </button>
            ) : (
              <div></div>
            )}

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing || saving || !apiKey.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium transition disabled:opacity-50 cursor-pointer"
              >
                {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {testing ? 'Validating...' : 'Test Key'}
              </button>

              <button
                type="button"
                onClick={handleSaveKey}
                disabled={testing || saving || !apiKey.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D6A84F] to-[#b3883b] hover:from-[#e5b95f] hover:to-[#c49747] text-black px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(214,168,79,0.2)]"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                )}
                {saving ? 'Saving...' : 'Save & Use Key'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
