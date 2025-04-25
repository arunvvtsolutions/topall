import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';


export const postCreateConceptTest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createConcepts}`, payload);
    return response.data;
  } catch (error) {
    throw error
  }
}
