import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import { GenerateTestProps } from '@/types/exams';
import axios from '@/utils/axios';

export const generateTest = async (payload: GenerateTestProps) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.generateTest}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExamPreData = async (streamId: number, StandardId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getPreData}/${streamId}/${StandardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGeneratedTests = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.genereatedTests}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getViewSyllabus = async (testId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.viewSyllabus}/${testId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
