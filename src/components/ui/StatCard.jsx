import React from 'react';

export default function StatCard({ title, value, icon: Icon, iconColor = 'text-emerald-400', valueColor = 'text-white', subtext, subtextColor = 'text-neutral-500', variant = 'default', children }) {
  const kpiClassMap = {
    income: 'artha-kpi-income',
    expense: 'artha-kpi-expense',
    savings: 'artha-kpi-savings',
    rate: 'artha-kpi-rate',
    default: 'artha-card',
  };

  const cardClass = kpiClassMap[variant] || 'artha-card';

  return (
    <div className={`${cardClass} p-4 rounded-xl space-y-2`}>
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
