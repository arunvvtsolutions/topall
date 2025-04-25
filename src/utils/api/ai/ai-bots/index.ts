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