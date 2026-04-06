import { cn, generateColor, getInitials } from "../../../lib/utils";


interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showOnline?: boolean;
  isOnline?: boolean;
}

const sizes = { xs: 'w-5 h-5 text-[9px]', sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' };

export function Avatar({ name, avatarUrl, size = 'md', className, showOnline, isOnline }: AvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div className={cn('rounded-full flex items-center justify-center font-semibold overflow-hidden', sizes[size])}
        style={{ background: avatarUrl ? undefined : generateColor(name) }}>
        {avatarUrl
          ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          : <span className="text-white">{getInitials(name)}</span>
        }
      </div>
      {showOnline && (
        <span className={cn('absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-[#080B11]',
          isOnline ? 'bg-green-400' : 'bg-slate-600')} />
      )}
    </div>
  );
}