import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

// GET API For Fetching Student Referral Info
export const fetchStudentReferralInfo = async (studentId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStudentReferralInfo}/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API For Fetching The Reffered Students Details
export const fetchReferredStudents = async (studentId: number, payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getReferredStudents}/${studentId}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
