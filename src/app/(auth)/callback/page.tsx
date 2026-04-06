// app/(auth)/callback/page.tsx
import { Suspense } from 'react';  // adjust path if needed
import { Loader2 } from 'lucide-react';
import CallbackClient from '@/components/common/CallbackClient';

export default function CallbackPage() {
  return (
    <Suspense fallback={
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
    }>
      <CallbackClient />
    </Suspense>
  );
}