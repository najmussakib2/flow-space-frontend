// app/(auth)/callback/CallbackClient.tsx   (or keep it in the same file if you prefer)
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '../../../redux/store/hooks';
import { setCredentials } from '../../../redux/slices/auth.slice';

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error('Authentication failed');
      router.push('/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch(setCredentials({ user: result.data, accessToken, refreshToken }));
        toast.success('Signed in with Google!');
        router.push('/');
      })
      .catch(() => {
        toast.error('Authentication failed');
        router.push('/login');
      });
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          ⚡
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={15} className="animate-spin" />
          Completing sign in...
        </div>
      </div>
    </div>
  );
}