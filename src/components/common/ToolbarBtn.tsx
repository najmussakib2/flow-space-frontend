import React from 'react';
import { cn } from '../../../lib/utils';

const ToolbarBtn = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button onClick={onClick}
      className={cn('p-1.5 rounded transition-colors', active ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5')}>
      {children}
    </button>
  );

export default ToolbarBtn;