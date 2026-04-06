import { cn } from "../../../lib/utils";
import { Priority } from "../../../types/api.types";


const config: Record<Priority, { label: string; color: string; dot: string }> = {
  URGENT: { label: 'Urgent', color: 'text-red-400 bg-red-400/10', dot: 'bg-red-400' },
  HIGH:   { label: 'High',   color: 'text-orange-400 bg-orange-400/10', dot: 'bg-orange-400' },
  MEDIUM: { label: 'Medium', color: 'text-blue-400 bg-blue-400/10', dot: 'bg-blue-400' },
  LOW:    { label: 'Low',    color: 'text-slate-400 bg-slate-400/10', dot: 'bg-slate-400' },
};

export function PriorityBadge({ priority, showLabel = true }: { priority: Priority; showLabel?: boolean }) {
  const c = config[priority];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', c.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {showLabel && c.label}
    </span>
  );
}