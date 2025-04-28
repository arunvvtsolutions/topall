import { API_BASE_URL } from "@/config";
import Apipoint from "@/types/enum";
import axios from "axios";
interface IAiPreviousChatHistoryProps {
    userId : number;
    botType : number;
}
export const getAiPreviousChatHistory = async (data: IAiPreviousChatHistoryProps) => {
    console.log(data,'hello');
    try {
      const res = await axios.post(`${API_BASE_URL}/${Apipoint.aiPreviousChatHistory}`, data);
      return res.data;
    } catch (error: any) {
      console.error('Error posting AI chapter questions:', error);
      return error?.response?.data || { success: false, message: error };
    }
  };