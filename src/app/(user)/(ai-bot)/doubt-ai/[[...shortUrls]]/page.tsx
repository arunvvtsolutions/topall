"use client";
import React, { useEffect, useState } from "react";
import { BOT_TYPE } from "@/utils/api/ai-doubt-module-dummy";
import { AI, ChatContainer } from "../../chapter-bot/components";
import { getCommonAiPrompts } from "@/utils/api/ai/ai-bots";


export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const [prompts, setPrompts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  const threadId = params.shortUrls?.find((para) => 
    para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-')
  );

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const fetchedPrompts = await getCommonAiPrompts(BOT_TYPE.COMMON_BOT);
        setPrompts(fetchedPrompts); 
      } catch (err) {
        setError("Failed to load prompts."); 
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

  return <ChatContainer botType={BOT_TYPE.COMMON_BOT} params={params} threadId={threadId} prompts={prompts} />;
}
