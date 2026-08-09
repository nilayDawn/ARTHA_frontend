import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-neutral-900 border-neutral-800 text-neutral-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <span className={`px-2 py-0.5 rounded border text-xs ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
}
