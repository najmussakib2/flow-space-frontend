/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '../../redux/store/hooks';
import { useCreateWorkspaceMutation, useGetWorkspacesQuery } from '../../redux/api/workspacesApi';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
});

type FormData = z.infer<typeof schema>;

export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data, isLoading } = useGetWorkspacesQuery(undefined, { skip: !isAuthenticated });
  const [createWorkspace, { isLoading: creating }] = useCreateWorkspaceMutation();
  const [showCreate, setShowCreate] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const nameValue = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      setValue('slug', nameValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [nameValue, setValue]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && data) {
      if (data.data?.length > 0) {
        // Has workspaces — redirect to first one
        router.push(`/workspace/${data.data[0].slug}`);
      } else {
        // No workspaces — show create form
        setShowCreate(true);
      }
    }
  }, [isAuthenticated, data, isLoading, router]);

  const onSubmit = async (formData: FormData) => {
    try {
      const result = await createWorkspace(formData).unwrap();
      toast.success('Workspace created!');
      router.push(`/workspace/${result.data.slug}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create workspace');
    }
  };

  // Still loading
  if (!showCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
            ⚡
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={15} className="animate-spin" />
            Loading your workspace...
          </div>
        </div>
      </div>
    );
  }

  // New user — no workspaces yet
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B11] p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Flow<span className="text-indigo-400">Space</span>
          </span>
        </div>

        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-white text-xl font-bold tracking-tight">Create your workspace</h1>
            <p className="text-slate-500 text-sm">
              A workspace is where your team collaborates. You can invite members after creating it.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Workspace name</label>
              <input
                {...register('name')}
                placeholder="Acme Corp"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Slug</label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-2.5 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg text-slate-500 text-sm font-mono">
                  flowspace.app/
                </span>
                <input
                  {...register('slug')}
                  placeholder="acme-corp"
                  className="flex-1 px-3 py-2.5 rounded-r-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
              {errors.slug && <p className="text-red-400 text-xs">{errors.slug.message}</p>}
              <p className="text-slate-600 text-xs">Only lowercase letters, numbers and hyphens</p>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {creating && <Loader2 size={15} className="animate-spin" />}
              {creating ? 'Creating...' : 'Create workspace →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}