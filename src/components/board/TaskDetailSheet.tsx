'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2, Calendar, User } from 'lucide-react';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Avatar } from '@/components/common/Avatar';
import { useAddCommentMutation, useGetTaskQuery } from '../../../redux/api/tasksApi';
import { formatDate, formatRelative } from '../../../lib/utils';

interface Props { taskId: string; open: boolean; onClose: () => void; }

export function TaskDetailSheet({ taskId, open, onClose }: Props) {
  const { data, isLoading } = useGetTaskQuery(taskId, { skip: !open });

  const [addComment] = useAddCommentMutation();
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const task = data?.data;

  const handleComment = async () => {
    if (!comment.trim() || posting) return;
    setPosting(true);
    try { await addComment({ taskId, content: comment }).unwrap(); setComment(''); }
    finally { setPosting(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[520px] bg-[#0D1117] border-l border-white/5 z-50 flex flex-col overflow-hidden"
          >
            {isLoading || !task ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={20} className="animate-spin text-slate-500" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-slate-500 text-xs font-mono">{task.board?.name}</span>
                  </div>
                  <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Title + Description */}
                  <div className="px-6 py-5 border-b border-white/5">
                    <h2 className="text-white text-lg font-semibold mb-2">{task.title}</h2>
                    {task.description
                      ? <p className="text-slate-400 text-sm leading-relaxed">{task.description}</p>
                      : <p className="text-slate-600 text-sm italic">No description</p>
                    }
                  </div>

                  {/* Meta */}
                  <div className="px-6 py-4 border-b border-white/5 space-y-3">
                    {task.assignee && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 w-20">
                          <User size={12} /> Assignee
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} size="xs" />
                          <span className="text-slate-300 text-sm">{task.assignee.name}</span>
                        </div>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 w-20">
                          <Calendar size={12} /> Due date
                        </div>
                        <span className="text-slate-300 text-sm">{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-500 w-20">Created</div>
                      <span className="text-slate-500 text-xs">{formatRelative(task.createdAt)}</span>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="px-6 py-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Comments ({task.comments?.length ?? 0})
                    </h3>
                    <div className="space-y-4">
                      {task.comments?.map((c) => (
                        <div key={c.id} className="flex gap-3">
                          <Avatar name={c.author.name} avatarUrl={c.author.avatarUrl} size="sm" className="flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-slate-300 text-xs font-medium">{c.author.name}</span>
                              <span className="text-slate-600 text-xs">{formatRelative(c.createdAt)}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      {task.comments?.length === 0 && (
                        <p className="text-slate-600 text-sm">No comments yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="px-6 py-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-white/5 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button onClick={handleComment} disabled={!comment.trim() || posting}
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-lg text-white transition-colors">
                      {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}