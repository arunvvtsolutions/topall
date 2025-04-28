import { API_BASE_URL } from "@/config";
import Apipoint from "@/types/enum";
import axios from "axios";

export const getAiBotsList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.aiBots}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getCommonAiPrompts = async (botType: number) => {
    try {
      // Change the request URL to pass `botType` in the URL path
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getAiPrompt}/${botType}`); 
      return response.data;
    } catch (error) {
      throw error;
    }
  };