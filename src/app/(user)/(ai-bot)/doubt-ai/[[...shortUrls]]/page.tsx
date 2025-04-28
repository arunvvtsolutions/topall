"use client";
import React, { useEffect, useState } from "react";
import { BOT_TYPE } from "@/utils/api/ai-doubt-module-dummy";
import { AI, ChatContainer } from "../../chapter-bot/components";
import { getCommonAiPrompts } from "@/utils/api/ai/ai-bots";


export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const [prompts, setPrompts] = useState<any[]>([]); // State to hold AI prompts
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State for errors

  const threadId = params.shortUrls?.find((para) => 
    para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-')
  );

  useEffect(() => {
    // Fetch the common AI prompts
    const fetchPrompts = async () => {
      try {
        const fetchedPrompts = await getCommonAiPrompts(BOT_TYPE.COMMON_BOT);
        setPrompts(fetchedPrompts); // Set the prompts in state
      } catch (err) {
        setError("Failed to load prompts."); // Handle error
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchPrompts();
  }, []); // Empty dependency array means this runs only once on component mount
    
  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return <ChatContainer botType={BOT_TYPE.COMMON_BOT} params={params} threadId={threadId} prompts={prompts} />;
}
