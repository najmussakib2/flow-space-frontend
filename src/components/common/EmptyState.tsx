interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-slate-300 font-semibold mb-1">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}