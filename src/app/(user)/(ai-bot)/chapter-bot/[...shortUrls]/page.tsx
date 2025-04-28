"use client";

import React from "react";
import ChatContainer from "../components/ChatContainer";
import { BOT_TYPE } from "@/utils/api/ai-doubt-module-dummy";
import { AI } from "../components";


export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const threadId = params.shortUrls?.find((para) => 
    para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-')
  );
  const subjectId = params.shortUrls?.[0];
  const chapterId = params.shortUrls?.[1];
  return <ChatContainer chapterId={Number(chapterId)} subjectId={Number(subjectId)}  botType={BOT_TYPE.ASK_DOUBTS}  params={params} threadId={threadId} />;
}
