import React from 'react';

export default function StatCard({ title, value, icon: Icon, iconColor = 'text-emerald-500/60', valueColor = 'text-white', subtext, subtextColor = 'text-neutral-600', children }) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-2">
      <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
        <span>{title}</span>
        {Icon && <Icon className={`w-3.5 h-3.5 ${iconColor}`} />}
      </div>
      <div className={`text-xl font-semibold ${valueColor}`}>{value}</div>
      {subtext && <p className={`text-[11px] ${subtextColor}`}>{subtext}</p>}
      {children}
    </div>
  );
}
