import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

export const fetchOverallSubjectWiseAnalysis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.overallSubjectWiseAnalysis}`);
    console.log('respose', response);
    return response.data;
  } catch (error) {
    throw error;
  }
};
