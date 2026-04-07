# FlowSpace Frontend

> AI-Augmented Team Productivity OS — Next.js Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)

---

## Overview

FlowSpace frontend is a production-grade Next.js 14 application providing a real-time collaborative workspace UI. It features a drag-and-drop Kanban board with optimistic updates, a Tiptap rich-text document editor, an AI assistant panel, WebSocket-powered presence and notifications, and a global command palette.

**Live App:** `https://your-frontend.vercel.app`
**Backend Repo:** [flowspace-backend](#)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| State | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS + Shadcn/ui |
| Animation | Framer Motion |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Editor | Tiptap + StarterKit + extensions |
| Real-time | Socket.io client |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Deployment | Vercel |

---

## Features

- **Authentication** — Email/password login, registration, Google OAuth 2.0, JWT auto-refresh with silent token rotation
- **Workspaces** — Multi-tenant workspaces with role-based access, member invites, and settings
- **Kanban Board** — Drag-and-drop task management with optimistic UI updates, fractional ordering, and real-time sync
- **Task Management** — Full task detail sheet with comments, priority badges, assignees, and due dates
- **Documents** — Tiptap rich-text editor with toolbar, auto-save with debounce, and real-time collaboration
- **AI Assistant** — Slide-in AI panel for document summarization, subtask generation, and free-form chat
- **Notifications** — Real-time push notifications via WebSocket, slide-in panel, mark as read
- **Presence** — Live online indicators showing which team members are active
- **Command Palette** — CMD+K global search across tasks, documents, and projects
- **Activity Feed** — Audit trail of all project actions

---

## Getting Started

### Prerequisites

- Node.js 18+
- FlowSpace backend running (see [backend repo](#))

### 1. Clone and install
```bash
git clone https://github.com/yourusername/flowspace-frontend.git
cd flowspace-frontend
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### 3. Start development server
```bash
npm run dev
```

Open `http://localhost:3000`

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/                    # Auth pages — login, register, OAuth callback
│   ├── (app)/                     # Protected pages — sidebar + topbar layout
│   │   └── workspace/[slug]/
│   │       ├── page.tsx           # Workspace home + team presence
│   │       ├── settings/          # Members, invite, danger zone
│   │       └── project/[id]/
│   │           ├── board/         # Kanban board
│   │           ├── docs/          # Document list + Tiptap editor
│   │           └── activity/      # Project activity feed
│   └── page.tsx                   # Root — redirect or create workspace
│
├── components/
│   ├── layout/                    # Sidebar, TopBar, CommandPalette, NotificationPanel
│   ├── board/                     # KanbanBoard, BoardColumn, TaskCard, TaskDetailSheet
│   ├── editor/                    # RichTextEditor, EditorToolbar
│   ├── ai/                        # AiPanel
│   └── common/                    # Avatar, PriorityBadge, EmptyState
│
├── store/
│   ├── slices/                    # auth, ui, presence
│   └── api/                       # RTK Query — auth, workspaces, projects, tasks, documents, notifications
│
├── hooks/                         # useWebSocket, useDebounce
├── lib/                           # axios instance, socket singleton, fractional-index, utils
└── types/                         # api.types.ts, socket.types.ts
```

---

## State Management
```
Server State  →  RTK Query (baseApi + injected endpoints)
Global UI     →  Redux slices (auth, ui, presence)
WebSocket     →  Socket.io client → dispatches to RTK Query cache
```

### Data flow
```
Page component
    → RTK Query hook (useGetProjectQuery)
    → axios instance (auto-attaches Bearer token)
    → NestJS backend
    → cached in Redux store
    → WebSocket event arrives
    → dispatches cache update
    → component re-renders
```

### Optimistic updates

Task moves on the Kanban board use RTK Query's `onQueryStarted` to update the UI instantly before the server responds. If the server rejects the move, the update is automatically rolled back:
```typescript
async onQueryStarted({ id, targetBoardId, order, projectId }, { dispatch, queryFulfilled }) {
  const patch = dispatch(
    baseApi.util.updateQueryData('getProject', projectId, (draft) => {
      // move task in cache immediately
    })
  );
  try {
    await queryFulfilled;
  } catch {
    patch.undo(); // revert on failure
  }
}
```

---

## Auth Flow
```
1. Login / Register → { accessToken, refreshToken } stored in localStorage
2. axios interceptor attaches token to every request automatically
3. On 401 → interceptor calls POST /auth/refresh silently
4. New tokens saved → original request retried automatically
5. On refresh failure → localStorage cleared → redirect to /login
6. WebSocket connects with token in handshake: { auth: { token } }
```

---

## Key Pages

| Route | Description |
|---|---|
| `/login` | Email/password + Google OAuth login |
| `/register` | Account creation with validation |
| `/` | Redirect to workspace or create workspace flow |
| `/workspace/:slug` | Workspace home with projects + team presence |
| `/workspace/:slug/settings` | Members, invite, workspace config |
| `/workspace/:slug/project/:id/board` | Kanban board with drag-and-drop |
| `/workspace/:slug/project/:id/docs` | Document list |
| `/workspace/:slug/project/:id/docs/:docId` | Tiptap editor with auto-save |
| `/workspace/:slug/project/:id/activity` | Project activity feed |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `http://localhost:3001` |

---

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
```

Vercel handles the Next.js build automatically. WebSocket connections go directly to the backend — Vercel only serves the static/SSR frontend.

---

## Scripts
```bash
npm run dev        # Development server at localhost:3000
npm run build      # Production build
npm run start      # Start production build
npm run lint       # ESLint
```