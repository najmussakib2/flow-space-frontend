export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#080B11] flex-col justify-between p-12">
        {/* Gradient orbs */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent 70%)' }} />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22D3EE, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Flow<span className="text-indigo-400">Space</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI-Augmented Productivity
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Your team&apos;s second<br />
              <span className="text-indigo-400">brain</span> — always on.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Real-time Kanban boards, collaborative docs, AI assistance, and smart notifications — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: '⚡', text: 'Real-time collaboration with WebSockets' },
              { icon: '🤖', text: 'AI that summarizes docs and generates tasks' },
              { icon: '🔔', text: 'Smart event-driven notifications' },
              { icon: '🎯', text: 'Drag-and-drop Kanban with optimistic UI' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-mono">
            &quot;The best tool is the one your team actually uses.&quot;
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0D1117]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}