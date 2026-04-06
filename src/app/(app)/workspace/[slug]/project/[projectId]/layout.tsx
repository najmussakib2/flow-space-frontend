'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useGetProjectQuery } from '../../../../../../../redux/api/projectsApi';
import { cn } from '../../../../../../../lib/utils';


const tabs = [
  { label: 'Board', href: 'board' },
  { label: 'Docs', href: 'docs' },
  { label: 'Activity', href: 'activity' },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const pathname = usePathname();
  const { data } = useGetProjectQuery(projectId);
  const project = data?.data;

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="border-b border-white/5 bg-[#0D1117] px-6 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: project?.color ? `${project.color}20` : '#6366F120' }}>
            {project?.icon || '📋'}
          </div>
          <div>
            <h1 className="text-white font-semibold text-base">{project?.name}</h1>
            {project?.description && <p className="text-slate-500 text-xs">{project.description}</p>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const href = `/workspace/${slug}/project/${projectId}/${tab.href}`;
            const active = pathname.startsWith(href);
            return (
              <Link key={tab.href} href={href} className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                active
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              )}>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}