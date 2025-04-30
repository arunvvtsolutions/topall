// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import { getCommonAiPrompts } from '@/utils/api/ai/ai-bots';
import { AI } from '../components';
import { getSubjects } from '@/store/slice/admin/academic';
import { RootState, useDispatch, useSelector } from '@/store';
import { BOT_TYPE } from '@/utils/api/ai-doubt-module-dummy';

export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const dispatch = useDispatch();

  // kick off subjects thunk
  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);

  // grab subjects from redux
  const subjects = useSelector((state: RootState) => state.academic.subjects);

  // extract IDs from URL
  const threadId  = params.shortUrls?.find(u => u.startsWith(AI.THREAD_KEY));
  const subjectId = Number(params.shortUrls?.[0]);
  const chapterId = Number(params.shortUrls?.[1]);

  // local state for the selected subject name
  const [subjectName, setSubjectName] = useState<string>('');

  // whenever `subjects` or `subjectId` change, look up the name
  useEffect(() => {
    if (!subjects.length || !subjectId) return;
    const found = subjects.find(s => s.id === subjectId);
    setSubjectName(found?.name ?? 'Unknown Subject');
  }, [subjects, subjectId]);

  // load your AI prompts
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string|null>(null);

  useEffect(() => {
    getCommonAiPrompts(BOT_TYPE.ASK_DOUBTS)
      .then(ps => setPrompts(ps))
      .catch(() => setError('Failed to load prompts.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <ChatContainer
      title={`Chapter Bot – ${subjectName}`}
      subjectId={subjectId}
      chapterId={chapterId}
      botType={BOT_TYPE.ASK_DOUBTS}
      threadId={threadId}
      params={params}
      prompts={prompts}
    />
  );
}
