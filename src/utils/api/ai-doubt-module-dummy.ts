// Dummy implementation of AI chat API functions
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Apipoint from '@/types/enum';
import { API_BASE_URL } from '@/config';
// Bot types enum
export enum BOT_TYPE {
  COMMON_BOT = 1,
  ASK_DOUBTS = 2,
  MCQ = 3,
  ASK_ADMISSIONS = 4,
  STUDY_PLAN_BOT = 5,
  PYQs_BOT = 6,
}

// Dummy token details
const DUMMY_TOKEN_COUNT = 100;

// Types for API responses
interface TokenResponse {
  success: boolean;
  data: {
    remainingTokens: number;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    messageId: string;
  };
}



// Dummy response generator for college suggestions
const collegeSuggestResponses = [
  "Based on your academic interests and profile, I would recommend considering universities like Stanford, MIT, and Carnegie Mellon for computer science programs. These institutions have excellent faculty, research opportunities, and industry connections.",
  "For scholarships, you might want to look into the National Merit Scholarship, Coca-Cola Scholars Program, and university-specific merit scholarships. Make sure to check application deadlines and requirements for each.",
  "When choosing between engineering and medicine, consider your personal interests, strengths, and long-term career goals. Engineering offers diverse specializations like mechanical, electrical, or software engineering, while medicine provides opportunities in clinical practice, research, or public health.",
  "For admission to top business schools, focus on maintaining a strong GPA, scoring well on standardized tests like the GMAT, gaining relevant work experience, and developing leadership skills through extracurricular activities.",
  "Liberal arts colleges offer a well-rounded education with smaller class sizes and more personalized attention. Some top liberal arts colleges include Williams, Amherst, and Swarthmore, which provide excellent preparation for graduate studies or various career paths."
];

// Dummy response generator for career advice
const careerAdviceResponses = [
  "Based on your background in computer science, roles in software engineering, data science, or AI research could be excellent fits. These fields offer competitive salaries, growth opportunities, and the chance to work on innovative technologies.",
  "To transition into product management, focus on developing skills in user experience design, market analysis, and project management. Consider taking relevant courses and seeking opportunities to lead cross-functional projects in your current role.",
  "For a successful career in digital marketing, develop expertise in SEO, content marketing, social media strategy, and analytics. Certifications from Google, HubSpot, or Facebook can enhance your credentials and marketability.",
  "Remote work opportunities have expanded significantly in fields like software development, content creation, digital marketing, and customer support. Companies like GitLab, Zapier, and Buffer are known for their strong remote work cultures.",
  "To stay competitive in today's job market, focus on developing both technical skills relevant to your field and soft skills like communication, adaptability, and problem-solving. Continuous learning through courses, certifications, or personal projects is essential."
];

// Generate a random response based on bot type
const generateDummyResponse = (message: string, botType: BOT_TYPE): string => {
  const responses = botType === BOT_TYPE.ASK_DOUBTS 
    ? collegeSuggestResponses 
    : careerAdviceResponses;
  
  // Select a random response
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Dummy implementation of getTokenDetails
export const getTokenDetails = async (): Promise<TokenResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      remainingTokens: DUMMY_TOKEN_COUNT
    }
  };
};

// Dummy implementation of sendMessage
export const sendMessage = async (
  message: string, 
  botType: BOT_TYPE,
  conversationId?: string
): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response = generateDummyResponse(message, botType);
  
  return {
    success: true,
    data: {
      message: response,
      messageId: uuidv4()
    }
  };
};

// Dummy implementation of createConversation
export const createConversation = async (botType: BOT_TYPE): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate and return a conversation ID
  return uuidv4();
};

// Dummy implementation of getConversationHistory
export const getConversationHistory = async (conversationId: string): Promise<ChatMessage[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return dummy conversation history
  return [
    {
      id: uuidv4(),
      content: "Hello, I need help with college suggestions.",
      role: 'user',
      timestamp: Date.now() - 3600000 // 1 hour ago
    },
    {
      id: uuidv4(),
      content: collegeSuggestResponses[0],
      role: 'assistant',
      timestamp: Date.now() - 3590000 // 59 minutes 50 seconds ago
    },
    {
      id: uuidv4(),
      content: "What about scholarships?",
      role: 'user',
      timestamp: Date.now() - 1800000 // 30 minutes ago
    },
    {
      id: uuidv4(),
      content: collegeSuggestResponses[1],
      role: 'assistant',
      timestamp: Date.now() - 1790000 // 29 minutes 50 seconds ago
    }
  ];
};


