/* eslint-disable @typescript-eslint/no-explicit-any */
export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_COMMENTED'
  | 'TASK_STATUS_CHANGED'
  | 'DOCUMENT_SHARED'
  | 'WORKSPACE_INVITE'
  | 'MENTION';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isVerified: boolean;
  provider?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: Plan;
  createdAt: string;
  members?: WorkspaceMember[];
  projects?: Project[];
  _count?: { members: number; projects: number };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: User;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: ProjectStatus;
  createdAt: string;
  boards?: Board[];
  _count?: { boards: number; documents: number };
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color?: string;
  tasks?: Task[];
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  boardId: string;
  creatorId: string;
  assigneeId?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  order: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  creator?: User;
  labels?: Label[];
  board?: { id: string; name: string; color?: string };
  comments?: Comment[];
  attachments?: Attachment[];
  activities?: ActivityLog[];
  _count?: { comments: number; attachments: number };
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface Attachment {
  id: string;
  taskId: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  authorId: string;
  title: string;
  content?: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  project?: { id: string; name: string };
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  action: string;
  metadata?: any;
  createdAt: string;
  user: User;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    unreadCount?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
}