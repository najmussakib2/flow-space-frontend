/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { useGetDocumentQuery, useUpdateDocumentMutation } from '../../../../../../../../../redux/api/documentsApi';
import { useDebounce } from '../../../../../../../../../hooks/useDebounce';

export default function DocPage() {
  const { docId } = useParams<{ docId: string }>();
  const { data, isLoading } = useGetDocumentQuery(docId);
  const [updateDocument] = useUpdateDocumentMutation();
  const [content, setContent] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(true);
  const debouncedContent = useDebounce(content, 1500);
  const debouncedTitle = useDebounce(title, 1000);
  const initialized = useRef(false);

  const doc = data?.data;

  useEffect(() => {
    if (doc && !initialized.current) {
      setContent(doc.content);
      setTitle(doc.title);
      initialized.current = true;
    }
  }, [doc]);

  useEffect(() => {
    if (!initialized.current || !docId) return;
    setSaved(false);
    updateDocument({ id: docId, content: debouncedContent, title: debouncedTitle })
      .unwrap()
      .then(() => setSaved(true))
      .catch(() => setSaved(false));
  }, [debouncedContent, debouncedTitle]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={20} className="animate-spin text-slate-500" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#080B11]">
      {/* Doc Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          className="text-white text-xl font-bold bg-transparent focus:outline-none flex-1 min-w-0"
          placeholder="Untitled"
        />
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
          {saved
            ? <><Check size={11} className="text-green-500" /> Saved</>
            : <><Loader2 size={11} className="animate-spin" /> Saving...</>
          }
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <RichTextEditor
          content={content}
          onChange={(c) => { setContent(c); setSaved(false); }}
        />
      </div>
    </div>
  );
}