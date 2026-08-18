export function TableSkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <div className="flex flex-col gap-2">
      {rows.map((_, index) => (
        <div
          key={index}
          className="h-14 bg-surface rounded-lg animate-pulse"
          style={{ animationDelay: `${index * 75}ms` }}
        />
      ))}
    </div>
  );
}