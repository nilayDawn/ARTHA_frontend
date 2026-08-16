export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 py-16 rounded-xl text-center space-y-2">
      {Icon && <Icon className="w-8 h-8 mx-auto stroke-1 text-neutral-700" />}
      {title && <p className="text-neutral-500 text-[13px]">{title}</p>}
      {subtitle && <p className="text-neutral-600 text-[11px]">{subtitle}</p>}
    </div>
  );
}
