/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification, Task } from './api.types';

export interface ServerToClientEvents {
  'notification:new': (notification: Notification) => void;
  'task:moved': (task: Task) => void;
  'member:online': (data: { userId: string }) => void;
  'member:offline': (data: { userId: string }) => void;
  'collaborator:joined': (data: { userId: string; socketId: string }) => void;
  'collaborator:left': (data: { userId: string }) => void;
  'document:updated': (data: { content: any; version: number; userId: string }) => void;
  'cursor:updated': (data: { userId: string; position: any; color: string; documentId: string }) => void;
}

export interface ClientToServerEvents {
  'join:workspace': (workspaceId: string) => void;
  'leave:workspace': (workspaceId: string) => void;
  'join:document': (documentId: string) => void;
  'leave:document': (documentId: string) => void;
  'document:update': (data: { documentId: string; content: any; version: number }) => void;
  'cursor:update': (data: { documentId: string; position: any; color: string }) => void;
  ping: () => void;
}