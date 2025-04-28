import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

// API For All India Mock Test List
export const getAllIndiaMockTestList = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.allIndiaMockTestList}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTestDates = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.allTestDates}`, payload);
    return response.data;
  } catch (error) {
    throw error
  }
}
