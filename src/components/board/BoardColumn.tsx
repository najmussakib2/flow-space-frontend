'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Board } from '../../../types/api.types';
import { useCreateTaskMutation } from '../../../redux/api/tasksApi';
import { cn } from '../../../lib/utils';
import { TaskCard } from './TaskCard';

interface Props { board: Board; projectId: string; }

export function BoardColumn({ board }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: board.id });
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const tasks = board.tasks ?? [];

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createTask({ boardId: board.id, title: title.trim() }).unwrap();
      setTitle('');
      setCreating(false);
      toast.success('Task created');
    } catch { toast.error('Failed to create task'); }
  };

  return (
    <div className={cn(
      'flex flex-col flex-shrink-0 w-72 rounded-xl bg-[#0D1117] border transition-colors',
      isOver ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5'
    )}>
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: board.color ?? '#6366F1' }} />
          <span className="text-slate-300 text-sm font-medium">{board.name}</span>
          <span className="text-slate-600 text-xs bg-white/5 px-1.5 py-0.5 rounded-full font-mono">{tasks.length}</span>
        </div>
        <button onClick={() => setCreating(true)}
          className="text-slate-600 hover:text-slate-400 transition-colors">
          <Plus size={15} />
        </button>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[100px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>

      {/* Create Task */}
      {creating ? (
        <div className="p-3 border-t border-white/5">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="Task title..."
            className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreate} disabled={isLoading || !title.trim()}
              className="flex-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
              {isLoading ? '...' : 'Add'}
            </button>
            <button onClick={() => { setCreating(false); setTitle(''); }}
              className="px-3 py-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 m-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 text-xs transition-all border border-dashed border-white/5 hover:border-white/10">
          <Plus size={13} /> Add task
        </button>
      )}
    </div>
  );
}