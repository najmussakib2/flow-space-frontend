'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { Avatar } from '@/components/common/Avatar';
import { useCreateDocumentMutation, useGetDocumentsQuery } from '../../../../../../../../redux/api/documentsApi';
import { formatRelative } from '../../../../../../../../lib/utils';

export default function DocsPage() {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const router = useRouter();
  const { data, isLoading } = useGetDocumentsQuery(projectId);
  const [createDocument, { isLoading: creating }] = useCreateDocumentMutation();
  const docs = data?.data ?? [];

  const handleCreate = async () => {
    try {
      const doc = await createDocument({ projectId, title: 'Untitled' }).unwrap();
      router.push(`/workspace/${slug}/project/${projectId}/docs/${doc.data.id}`);
    } catch { toast.error('Failed to create document'); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold">Documents</h2>
        <button onClick={handleCreate} disabled={creating}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={14} /> New Doc
        </button>
      </div>

      {docs.length === 0
        ? <EmptyState icon="📝" title="No documents yet" description="Create your first document to start collaborating."
            action={<button onClick={handleCreate} className="text-indigo-400 text-sm hover:text-indigo-300">Create document →</button>} />
        : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <button key={doc.id} onClick={() => router.push(`/workspace/${slug}/project/${projectId}/docs/${doc.id}`)}
                className="w-full flex items-center gap-4 p-4 bg-[#0D1117] border border-white/5 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-left group">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">{doc.title}</p>
                  <p className="text-slate-600 text-xs mt-0.5">Updated {formatRelative(doc.updatedAt)}</p>
                </div>
                <Avatar name={doc.author.name} avatarUrl={doc.author.avatarUrl} size="xs" />
              </button>
            ))}
          </div>
        )
      }
    </div>
  );
}