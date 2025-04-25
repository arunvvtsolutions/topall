import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

export const fetchUpcomingTests = async(streamId: number, standardId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.upcomingTests}/${streamId}/${standardId}`);
    return response;
  } catch (error) {
    throw error;
  }
}