/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Settings, ChevronDown, ChevronRight,
  Plus, PanelLeftClose, Loader2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { useGetWorkspaceQuery } from '../../../redux/api/workspacesApi';
import { toggleSidebar } from '../../../redux/slices/ui.slice';
import { Avatar } from '../common/Avatar';
import { cn } from '../../../lib/utils';

export function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);
  const [projectsOpen, setProjectsOpen] = useState(true);

  // Extract slug from URL
  const slugMatch = pathname.match(/\/workspace\/([^/]+)/);
  const slug = slugMatch?.[1] ?? '';

  const { data: workspace, isLoading } = useGetWorkspaceQuery(slug, { skip: !slug });
  const ws = workspace?.data;

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-shrink-0 h-screen bg-[#0D1117] border-r border-white/5 flex flex-col overflow-hidden"
        >
          {/* Workspace Header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-sm flex-shrink-0 shadow-lg shadow-indigo-500/20">
                {ws?.logoUrl ? <img src={ws.logoUrl} className="w-full h-full rounded-lg object-cover" /> : '⚡'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{ws?.name ?? 'FlowSpace'}</p>
                <p className="text-slate-500 text-xs capitalize">{ws?.plan?.toLowerCase() ?? 'free'} plan</p>
              </div>
              <button onClick={() => dispatch(toggleSidebar())} className="text-slate-600 hover:text-slate-400 transition-colors">
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
            <NavItem href={`/workspace/${slug}`} icon={<LayoutDashboard size={15} />} label="Home" pathname={pathname} exact />

            {/* Projects */}
            <div>
              <button
                onClick={() => setProjectsOpen(!projectsOpen)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors group"
              >
                {projectsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span className="flex-1 text-left uppercase tracking-wider">Projects</span>
                <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <AnimatePresence>
                {projectsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden ml-2"
                  >
                    {isLoading && (
                      <div className="flex items-center gap-2 px-2 py-2 text-slate-600 text-xs">
                        <Loader2 size={12} className="animate-spin" /> Loading...
                      </div>
                    )}
                    {ws?.projects?.map((project) => (
                      <ProjectItem key={project.id} project={project} slug={slug} pathname={pathname} />
                    ))}
                    {ws && ws.projects?.length === 0 && (
                      <p className="text-slate-600 text-xs px-2 py-2">No projects yet</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2">
              <NavItem href={`/workspace/${slug}/settings`} icon={<Settings size={15} />} label="Settings" pathname={pathname} />
            </div>
          </nav>

          {/* User */}
          {user && (
            <div className="p-3 border-t border-white/5">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{user.name}</p>
                  <p className="text-slate-600 text-xs truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function NavItem({ href, icon, label, pathname, exact }: {
  href: string; icon: React.ReactNode; label: string; pathname: string; exact?: boolean;
}) {
  const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/workspace/';
  return (
    <Link href={href} className={cn(
      'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors',
      active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    )}>
      {icon}
      {label}
    </Link>
  );
}

function ProjectItem({ project, slug, pathname }: { project: any; slug: string; pathname: string }) {
  const [open, setOpen] = useState(false);
  const projectBase = `/workspace/${slug}/project/${project.id}`;
  const active = pathname.startsWith(projectBase);

  return (
    <div>
      <div className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer group',
        active ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      )}>
        <button onClick={() => setOpen(!open)} className="flex-shrink-0">
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </button>
        <Link href={`${projectBase}/board`} className="flex items-center gap-2 flex-1 min-w-0">
          <span>{project.icon || '📋'}</span>
          <span className="truncate font-medium">{project.name}</span>
        </Link>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-6 overflow-hidden"
          >
            {[
              { label: 'Board', href: `${projectBase}/board` },
              { label: 'Docs', href: `${projectBase}/docs` },
              { label: 'Activity', href: `${projectBase}/activity` },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={cn(
                'block px-2 py-1 text-xs rounded-md transition-colors',
                pathname.startsWith(item.href) ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'
              )}>
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}