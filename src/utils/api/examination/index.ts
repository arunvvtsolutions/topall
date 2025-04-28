import { API_BASE_URL } from '@/config';
import axios from 'axios';
import Apipoint from '@/types/enum';
import question from '@/components/admin/sections/questions/questions.json';

// API for creating a new test
export const createTest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createTest}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for updating an existing test by ID
export const updateTest = async (testId: number, payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateTest}/${testId}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a single test by ID
export const getSingleTest = async (testId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.fetchSingleTest}/${testId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTestList = async (testId: number|null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.TetstList}/${testId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getQuestionList = async (
  id: number,
  subjectId: number | null,
  selectedTestId: number | null,
  questionType: number | null,
  streamId: number | null
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.importList}/${id}/${subjectId}/${selectedTestId}/${questionType}/${streamId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
