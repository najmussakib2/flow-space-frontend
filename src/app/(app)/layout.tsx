'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { connectSocket, disconnectSocket } from '../../../lib/socket';
import { userCameOnline, userWentOffline } from '../../../redux/slices/presence.slice';
import { baseApi } from '../../../redux/api/baseApi';
import { cn } from '../../../lib/utils';
import { AiPanel } from '@/components/ai/AiPanel';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const socket = connectSocket();

    socket.on('member:online', ({ userId }) => dispatch(userCameOnline(userId)));
    socket.on('member:offline', ({ userId }) => dispatch(userWentOffline(userId)));
    socket.on('notification:new', () => {
      dispatch(baseApi.util.invalidateTags(['Notification']));
    });

    return () => {
      socket.off('member:online');
      socket.off('member:offline');
      socket.off('notification:new');
      disconnectSocket();
    };
  }, [isAuthenticated, dispatch, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#080B11] overflow-hidden">
      <Sidebar />
      <div className={cn('flex flex-col flex-1 min-w-0 transition-all duration-300')}>
        <TopBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <CommandPalette />
      <NotificationPanel />
      <AiPanel />
    </div>
  );
}