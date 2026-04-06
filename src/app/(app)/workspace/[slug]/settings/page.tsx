/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Avatar } from '@/components/common/Avatar';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';
import { useAppDispatch } from '../../../../../../redux/store/hooks';
import { useGetWorkspaceQuery, useInviteMemberMutation } from '../../../../../../redux/api/workspacesApi';
import { logout } from '../../../../../../redux/slices/auth.slice';

export default function SettingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetWorkspaceQuery(slug);
  const [inviteMember, { isLoading: inviting }] = useInviteMemberMutation();
  const [email, setEmail] = useState('');
  const ws = data?.data;

  const handleInvite = async () => {
    if (!email.trim() || !ws) return;
    try {
      await inviteMember({ workspaceId: ws.id, email: email.trim(), role: 'MEMBER' }).unwrap();
      toast.success('Invitation sent!');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to invite member');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-white text-xl font-bold">Workspace Settings</h1>

      {/* General */}
      <div className="bg-[#0D1117] border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm">General</h2>
        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs">Workspace name</label>
          <input defaultValue={ws?.name}
            className="w-full px-3 py-2 bg-slate-800 border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs">Slug</label>
          <input defaultValue={ws?.slug} disabled
            className="w-full px-3 py-2 bg-slate-800/50 border border-white/5 rounded-lg text-slate-500 text-sm cursor-not-allowed font-mono" />
        </div>
      </div>

      {/* Members */}
      <div className="bg-[#0D1117] border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm">Members ({ws?.members?.length})</h2>

        {/* Invite */}
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="colleague@company.com"
            className="flex-1 px-3 py-2 bg-slate-800 border border-white/5 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
          <button onClick={handleInvite} disabled={inviting || !email.trim()}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
            Invite
          </button>
        </div>

        {/* Member list */}
        <div className="space-y-2">
          {ws?.members?.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2">
              <Avatar name={m.user.name} avatarUrl={m.user.avatarUrl} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-sm font-medium">{m.user.name}</p>
                <p className="text-slate-600 text-xs">{m.user.email}</p>
              </div>
              <span className="text-xs text-slate-500 capitalize bg-white/5 px-2 py-0.5 rounded-full">
                {m.role.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
        <h2 className="text-red-400 font-semibold text-sm">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-sm font-medium">Sign out</p>
            <p className="text-slate-500 text-xs">Sign out from all sessions</p>
          </div>
          <button onClick={handleLogout}
            className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm rounded-lg transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}