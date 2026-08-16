export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 font-normal mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
