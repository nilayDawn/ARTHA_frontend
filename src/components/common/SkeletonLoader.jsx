export default function SkeletonLoader({ type = 'card', count = 1 }) {
  if (type === 'page') {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 bg-neutral-800/60 rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-neutral-800/40 rounded-2xl border border-neutral-800/60"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-neutral-800/40 rounded-2xl border border-neutral-800/60"></div>
          <div className="h-72 bg-neutral-800/40 rounded-2xl border border-neutral-800/60"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 bg-neutral-800/60 rounded-xl"></div>
        {Array.from({ length: count || 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-800/30 rounded-xl border border-neutral-800/40"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count || 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-neutral-800/40 rounded-2xl border border-neutral-800/50"></div>
      ))}
    </div>
  );
}
