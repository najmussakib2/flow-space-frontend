import { useEffect } from 'react';
import { getSocket } from '../lib/socket';


export function useWebSocket(workspaceId: string | null) {
  useEffect(() => {
    if (!workspaceId) return;
    const socket = getSocket();
    socket.emit('join:workspace', workspaceId);
    return () => { socket.emit('leave:workspace', workspaceId); };
  }, [workspaceId]);
}