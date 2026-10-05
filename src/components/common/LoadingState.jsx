import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center h-40 text-neutral-500 gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
      <span className="text-xs">{message}</span>
    </div>
  );
}
