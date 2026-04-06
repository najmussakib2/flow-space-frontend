'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Avatar } from '@/components/common/Avatar';
import { MessageSquare, Paperclip, Calendar } from 'lucide-react';
import { Task } from '../../../types/api.types';
import { cn, formatDate } from '../../../lib/utils';
import { TaskDetailSheet } from './TaskDetailSheet';

interface Props { task: Task; isDragging?: boolean; }

export function TaskCard({ task, isDragging }: Props) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'group p-3 bg-[#111820] border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-500/30 transition-all',
            isDragging && 'shadow-2xl shadow-indigo-500/20 rotate-2 scale-105 border-indigo-500/40'
          )}
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        >
          {/* Priority */}
          <div className="flex items-center justify-between mb-2">
            <PriorityBadge priority={task.priority} showLabel={false} />
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Calendar size={10} />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          {/* Title */}
          <p className="text-slate-300 text-sm font-medium leading-snug mb-3 group-hover:text-white transition-colors">
            {task.title}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              {(task._count?.comments ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare size={11} /> {task._count?.comments}
                </span>
              )}
              {(task._count?.attachments ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Paperclip size={11} /> {task._count?.attachments}
                </span>
              )}
            </div>
            {task.assignee && (
              <Avatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} size="xs" />
            )}
          </div>
        </motion.div>
      </div>

      <TaskDetailSheet taskId={task.id} open={open} onClose={() => setOpen(false)} />
    </>
  );
}