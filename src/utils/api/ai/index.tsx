import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

interface IChatAiProps {
  botType: number;
  message: string;
}

export const getStreamById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface IAiDoubtModuleSendProps {
  message : string;
  userId : number;
  threadId : string;
  botType : number;
  history : any;
  chapterId : number;
  subjectId : number;
  assetUrl? : string;
}
export const postChapterWiseAiBot = async (data: IAiDoubtModuleSendProps) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/${Apipoint.aiChapterModule}`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error posting AI chapter questions:', error);
    return error?.response?.data || { success: false, message: error };
  }
};

export const postDoubtAiBot = async (data: IAiDoubtModuleSendProps) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/${Apipoint.aiDoubtModule}`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error posting AI chapter questions:', error);
    return error?.response?.data || { success: false, message: error };
  }
};

export const getAiBotAnswerByThreadId = async (threadId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.aiBotAnswerByThreadId}/${threadId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
