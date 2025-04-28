import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import { SectionData } from '@/types/online-exams';
import axios from '@/utils/axios';

// Update questions for online examination
export const updateExamQuestion = async (payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.oeUpdateTest}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get questions for start online examination
export const oeStartExam = async (studentId: number, testType: number, testId: string, streamId: number, standardId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.oeStartTest}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get questions for resume online examination
export const oeResumeExam = async (studentId: number, testType: number, testId: string, streamId: number, standardId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.oeResumeTest}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get questions for retake online examination
export const oeRetakeExam = async (studentId: number, testType: number, testId: string, streamId: number, standardId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.oeRetakeTest}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update questions for online examination
export const updateTestEachSecond = async (payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.oeUpdateTestEachSecond}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Submit test for online examination
export const submitTest = async (studentId: string, testType: number, testId: string, streamId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.oeSubmitTest}/${studentId}/${testType}/${testId}/${streamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Mark calulate test for online examination
export const markCalculate = async (
  studentId: string,
  testType: number,
  testId: string,
  streamId: number,
  standardId: number
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${Apipoint.oeMarkCalculation}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Overall mark calculate test for online examination
export const overallAnalysisCalculate = async (studentId: string, streamId: number, testType: number, testId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.calculateOverallAnalysis}/${studentId}/${streamId}/${testType}/${testId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
