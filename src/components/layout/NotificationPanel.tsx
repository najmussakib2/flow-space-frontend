'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from '../../../redux/api/notificationsApi';
import { setNotificationPanelOpen } from '../../../redux/slices/ui.slice';
import { Notification } from '../../../types/api.types';
import { cn, formatRelative } from '../../../lib/utils';


const typeIcon: Record<string, string> = {
  TASK_ASSIGNED: '✅',
  TASK_COMMENTED: '💬',
  TASK_STATUS_CHANGED: '🔄',
  DOCUMENT_SHARED: '📝',
  WORKSPACE_INVITE: '🏢',
  MENTION: '@',
};

export function NotificationPanel() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.notificationPanelOpen);
  const { data, isLoading } = useGetNotificationsQuery({});
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data ?? [];
  const unreadCount = data?.meta?.unreadCount ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => dispatch(setNotificationPanelOpen(false))}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-[#0D1117] border-l border-white/5 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-slate-400" />
                <h2 className="text-white font-semibold text-sm">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={() => markAllAsRead()}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <Check size={12} /> Mark all read
                  </button>
                )}
                <button onClick={() => dispatch(setNotificationPanelOpen(false))}
                  className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-slate-400 font-medium text-sm">You&apos;re all caught up!</p>
                  <p className="text-slate-600 text-xs mt-1">No new notifications</p>
                </div>
              )}

              {notifications.map((n: Notification) => (
                <motion.div
                  key={n.id}
                  layout
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={cn(
                    'flex gap-3 px-5 py-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5',
                    !n.isRead && 'bg-indigo-500/5 border-l-2 border-l-indigo-500'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm flex-shrink-0">
                    {typeIcon[n.type] ?? '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm leading-snug', n.isRead ? 'text-slate-400' : 'text-white font-medium')}>
                      {n.title}
                    </p>
                    {n.body && <p className="text-slate-500 text-xs mt-0.5 truncate">{n.body}</p>}
                    <p className="text-slate-600 text-xs mt-1">{formatRelative(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}