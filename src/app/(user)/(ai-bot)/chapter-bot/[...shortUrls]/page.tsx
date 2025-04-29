'use client';

import React, { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import { BOT_TYPE } from '@/utils/api/ai-doubt-module-dummy';
import { getCommonAiPrompts } from '@/utils/api/ai/ai-bots';
import { AI } from '../components';

export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const threadId = params.shortUrls?.find((para) => para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-'));
  const subjectId = params.shortUrls?.[0];
  const chapterId = params.shortUrls?.[1];

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const fetchedPrompts = await getCommonAiPrompts(BOT_TYPE.ASK_DOUBTS);
        setPrompts(fetchedPrompts);
      } catch (err) {
        setError('Failed to load prompts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ChatContainer
      title="Chapter Bot"
      chapterId={Number(chapterId)}
      subjectId={Number(subjectId)}
      botType={BOT_TYPE.ASK_DOUBTS}
      params={params}
      threadId={threadId}
      prompts={prompts}
    />
  );
}
