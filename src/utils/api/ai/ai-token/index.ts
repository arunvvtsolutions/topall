import { API_BASE_URL } from "@/config";
import Apipoint from "@/types/enum";
import axios from "axios";

export const getAiTokenById = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.aiToken}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };