import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, className = "" }) {
  if (!message) return null;

  return (
    <div className={`p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 ${className}`}>
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
