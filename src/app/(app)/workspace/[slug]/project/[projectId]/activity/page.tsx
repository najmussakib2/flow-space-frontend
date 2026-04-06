/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../../../../../../../lib/axios';
import { formatRelative } from '../../../../../../../../lib/utils';

const actionLabel: Record<string, string> = {
  'task.created': 'created task',
  'task.moved': 'moved task',
  'task.commented': 'commented on task',
};

export default function ActivityPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/activity/project/${projectId}`)
      .then((res) => setActivities(res.data.data ?? []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-white font-semibold mb-6">Activity</h2>
      {activities.length === 0
        ? <p className="text-slate-500 text-sm">No activity yet.</p>
        : (
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.id} className="flex gap-3">
                <Avatar name={a.user.name} avatarUrl={a.user.avatarUrl} size="sm" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-400 text-sm">
                    <span className="text-white font-medium">{a.user.name}</span>
                    {' '}{actionLabel[a.action] ?? a.action}
                    {a.metadata?.title && <span className="text-indigo-400">{a.metadata.title}</span>}
                    {a.metadata?.to && <span className="text-slate-500"> → {a.metadata.to}</span>}
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">{formatRelative(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}