"use client";
import React, { useEffect, useState } from "react";
import { BOT_TYPE } from "@/utils/api/ai-doubt-module-dummy";
<<<<<<< HEAD
import { ChatContainer } from "../../chapter-bot/components";
import { getCommonAiPrompts } from "@/utils/api/ai/ai-bots";

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
  const [prompts, setPrompts] = useState<any[]>([]); // State to hold AI prompts
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State for errors
=======
import { AI, ChatContainer } from "../../chapter-bot/components";
import { getCommonAiPrompts } from "@/utils/api/ai/ai-bots";


export default function Page({ params }: { params: { shortUrls: string[] } }) {
  const [prompts, setPrompts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
>>>>>>> cfab089 (changes in ui dev + arun)

  const threadId = params.shortUrls?.find((para) => 
    para.startsWith(AI.THREAD_KEY) || para.startsWith('CS-')
  );

  useEffect(() => {
<<<<<<< HEAD
    // Fetch the common AI prompts
    const fetchPrompts = async () => {
      try {
        const fetchedPrompts = await getCommonAiPrompts(BOT_TYPE.COMMON_BOT);
        setPrompts(fetchedPrompts); // Set the prompts in state
      } catch (err) {
        setError("Failed to load prompts."); // Handle error
      } finally {
        setLoading(false); // Set loading to false once the request is complete
=======
    const fetchPrompts = async () => {
      try {
        const fetchedPrompts = await getCommonAiPrompts(BOT_TYPE.COMMON_BOT);
        setPrompts(fetchedPrompts); 
      } catch (err) {
        setError("Failed to load prompts."); 
      } finally {
        setLoading(false); 
>>>>>>> cfab089 (changes in ui dev + arun)
      }
    };

    fetchPrompts();
<<<<<<< HEAD
  }, []); // Empty dependency array means this runs only once on component mount
    
  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
=======
  }, []); 
    
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
>>>>>>> cfab089 (changes in ui dev + arun)
  }

  return <ChatContainer botType={BOT_TYPE.COMMON_BOT} params={params} threadId={threadId} prompts={prompts} />;
}
