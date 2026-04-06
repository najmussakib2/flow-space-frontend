'use client';

import { useParams } from 'next/navigation';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { useGetProjectQuery } from '../../../../../../../../redux/api/projectsApi';

export default function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useGetProjectQuery(projectId);
  const project = data?.data;

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  if (!project?.boards?.length) return (
    <EmptyState icon="📋" title="No boards found" description="Something went wrong loading this project." />
  );

  return <KanbanBoard boards={project.boards} projectId={projectId} />;
}