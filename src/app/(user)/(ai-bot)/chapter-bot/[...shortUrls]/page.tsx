<<<<<<< HEAD
"use client";

import React from "react";
import ChatContainer from "../components/ChatContainer";
import { BOT_TYPE } from "@/utils/api/ai-doubt-module-dummy";

export enum AI {
  ERROR_MESSAGE = "I'm sorry, but I'm unable to provide an answer to that question right now. If you have any other questions or need assistance with something else, feel free to ask!",
  CHAT_HISTORY_EMPTY = "Chat history is empty",
  TOKENS_COMPLETED = "Not having enough Credits",
  TOKENS_COMPLETED_DES = "Your Credits are completed. Kindly pay to continue.",
  ASK_DOUBTS = "Ask doubts",
  DOUBTS_AI = "Doubts AI",
  ADMISSION_BOT = "AI NEET Predictor",
  START_UR_CHAT = "Hello, How can i help you today",
  TOKEN_COUNT = "Available Credits :",
  FOR_MORE_TOKENS = "For More Credits",
  BUY_NOW = "Buy Now",
  AI_SESSION_KEY = "ai-initial-msg",
  THREAD_KEY = "CS",
  ASK_ANYTHNG_ABT_NEET_EXAM = "AI CBSE Predictor",
  CAREER_BOT_TITLE = "Career CBSE Predictor",
  PLACE_HOLDER = "Hi! I'm your AI CBSE Predictor.",
  CAREER_BOT_PLACE_HOLDER = "Hi! I'm your Career CBSE Predictor.",
  SUB_PLACE_HOLDER = "How can I help you with college admissions, counseling, or predictions today?",
  CAREER_BOT_SUB_PLACE_HOLDER = "How can I help you with college admissions, counseling, or predictions today?",
  TEXT_AREA_PLACEHOLDER = "Instant CBSE help - college predictions, counseling & admissions",
  CAREER_BOT_TEXT_AREA_PLACEHOLDER = "Instant CBSE help - college predictions, counseling & admissions",
}

export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const threadId = params.shortUrls?.find((para) => 
    para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-')
  );
  const subjectId = params.shortUrls?.[0];
  const chapterId = params.shortUrls?.[1];
  return <ChatContainer chapterId={Number(chapterId)} subjectId={Number(subjectId)}  botType={BOT_TYPE.ASK_DOUBTS}  params={params} threadId={threadId} />;
=======
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
>>>>>>> cfab089 (changes in ui dev + arun)
}
