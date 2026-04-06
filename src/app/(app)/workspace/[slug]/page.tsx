'use client';

import { useParams } from 'next/navigation';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store/hooks';
import { useGetWorkspaceQuery } from '../../../../../redux/api/workspacesApi';
import { useCreateProjectMutation } from '../../../../../redux/api/projectsApi';
import { useWebSocket } from '../../../../../hooks/useWebSocket';
import { setActiveWorkspace } from '../../../../../redux/slices/ui.slice';

export default function WorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useGetWorkspaceQuery(slug);
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const ws = data?.data;
  const onlineUserIds = useAppSelector((s) => s.presence.onlineUserIds);

  useEffect(() => { if (slug) dispatch(setActiveWorkspace(slug)); }, [slug, dispatch]);
  useWebSocket(ws?.id ?? null);

  const handleCreateProject = async () => {
    const name = prompt('Project name:');
    if (!name || !ws) return;
    try {
      await createProject({ workspaceId: ws.id, name, icon: '📋' }).unwrap();
      toast.success('Project created!');
      refetch()
    } catch { toast.error('Failed to create project'); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{ws?.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{ws?.members?.length} members · {ws?.projects?.length} projects</p>
        </div>
        <button onClick={handleCreateProject} disabled={creating}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Members Online */}
      <div className="bg-[#0D1117] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-400 mb-4">Team</h2>
        <div className="flex flex-wrap gap-3">
          {ws?.members?.map((m) => (
            <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <Avatar name={m.user.name} avatarUrl={m.user.avatarUrl} size="sm"
                showOnline isOnline={onlineUserIds.includes(m.userId)} />
              <div>
                <p className="text-white text-xs font-medium">{m.user.name}</p>
                <p className="text-slate-600 text-xs capitalize">{m.role.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-4">Projects</h2>
        {ws?.projects?.length === 0
          ? <EmptyState icon="📋" title="No projects yet" description="Create your first project to get started."
              action={<button onClick={handleCreateProject} className="text-indigo-400 text-sm hover:text-indigo-300">Create project →</button>} />
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ws?.projects?.map((project) => (
                <Link key={project.id} href={`/workspace/${slug}/project/${project.id}/board`}
                  className="group p-5 bg-[#0D1117] border border-white/5 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                      style={{ background: project.color ? `${project.color}20` : '#6366F120' }}>
                      {project.icon || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate group-hover:text-indigo-300 transition-colors">{project.name}</p>
                      <p className="text-slate-500 text-xs capitalize">{project.status.toLowerCase()}</p>
                    </div>
                  </div>
                  {project.description && <p className="text-slate-600 text-xs line-clamp-2">{project.description}</p>}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 font-mono">
                    <span>{project._count?.boards ?? 0} boards</span>
                    <span>{project._count?.documents ?? 0} docs</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}