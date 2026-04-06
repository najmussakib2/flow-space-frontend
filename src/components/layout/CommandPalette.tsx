/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { setCommandPaletteOpen } from '../../../redux/slices/ui.slice';
import axiosInstance from '../../../lib/axios';
import { useDebounce } from '../../../hooks/useDebounce';

export function CommandPalette() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((s) => s.ui.commandPaletteOpen);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!open));
      }
      if (e.key === 'Escape') dispatch(setCommandPaletteOpen(false));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, dispatch]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults(null); return; }
    setLoading(true);
    axiosInstance.get(`/search?q=${debouncedQuery}&workspaceId=all`)
      .then((res) => setResults(res.data.data))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) { setQuery(''); setResults(null); }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => dispatch(setCommandPaletteOpen(false))}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#0D1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                {loading ? <Loader2 size={16} className="text-slate-500 animate-spin" /> : <Search size={16} className="text-slate-500" />}
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks, documents, projects..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
                />
                <kbd className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              </div>

              {results && (
                <div className="max-h-80 overflow-y-auto p-2">
                  {results.tasks?.length > 0 && (
                    <Section title="Tasks">
                      {results.tasks.map((t: any) => (
                        <ResultItem key={t.id} icon="✅" title={t.title} sub={t.board?.project?.name}
                          onClick={() => { dispatch(setCommandPaletteOpen(false)); }} />
                      ))}
                    </Section>
                  )}
                  {results.documents?.length > 0 && (
                    <Section title="Documents">
                      {results.documents.map((d: any) => (
                        <ResultItem key={d.id} icon="📝" title={d.title} sub={d.project?.name}
                          onClick={() => { dispatch(setCommandPaletteOpen(false)); router.push(`/workspace/${d.project?.id}/docs/${d.id}`); }} />
                      ))}
                    </Section>
                  )}
                  {results.projects?.length > 0 && (
                    <Section title="Projects">
                      {results.projects.map((p: any) => (
                        <ResultItem key={p.id} icon={p.icon || '📋'} title={p.name}
                          onClick={() => { dispatch(setCommandPaletteOpen(false)); }} />
                      ))}
                    </Section>
                  )}
                  {!results.tasks?.length && !results.documents?.length && !results.projects?.length && (
                    <p className="text-slate-600 text-sm text-center py-8">No results found</p>
                  )}
                </div>
              )}

              {!query && (
                <div className="p-4 text-center text-slate-600 text-xs font-mono">
                  Type to search across your workspace
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="text-[10px] font-mono uppercase text-slate-600 px-2 py-1 tracking-wider">{title}</p>
      {children}
    </div>
  );
}

function ResultItem({ icon, title, sub, onClick }: { icon: string; title: string; sub?: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
      <span className="text-sm">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-sm truncate">{title}</p>
        {sub && <p className="text-slate-600 text-xs truncate">{sub}</p>}
      </div>
    </button>
  );
}