import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

// GET API for fetching the answer keys
export const getAnswerKey = async (
  studentID: number,
  testTypeID: number,
  testID: number,
  streamID: number,
  standardID: number,
  attemptId: string
) => {
  const url = `${API_BASE_URL}/${Apipoint.getAnswerKey}/${studentID}/${testTypeID}/${testID}/${streamID}/${standardID}`;
  const params = attemptId ? { attemptId } : {};
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
