export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-emerald-400',
  valueColor = 'text-white',
  subtext,
  subtextColor = 'text-neutral-500',
  variant = 'default',
  children,
}) {
  const kpiClassMap = {
    income: 'artha-kpi-income',
    expense: 'artha-kpi-expense',
    savings: 'artha-kpi-savings',
    rate: 'artha-kpi-rate',
    default: 'artha-card',
  };

  return (
    <div
      className={`${kpiClassMap[variant] || kpiClassMap.default} rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-neutral-900 border border-white/[0.08]">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="my-1">
        <h4 className={`text-2xl font-bold tracking-tight ${valueColor}`}>{value}</h4>
        {subtext && <p className={`text-xs mt-1 font-medium ${subtextColor}`}>{subtext}</p>}
      </div>

      {children && <div className="mt-3 pt-3 border-t border-white/[0.055]">{children}</div>}
    </div>
  );
}
