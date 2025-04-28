import { ChapterwiseResultProps } from '@/components/user/result/chapter-wise-analysis/chapter-wise-analysis';
import { subjectwiseResultApiProps } from '@/components/user/result/subject-wisemarks/subject-wise-marks';
import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

export const getSubjectwiseResultApi = async (
  studentId: number,
  testType: number,
  testId: number,
  streamId: number,
  standardId: number,
  attemptId: string
): Promise<{ statusCode: number; data: subjectwiseResultApiProps[] }> => {
  const url = `${API_BASE_URL}/${Apipoint.getSubjectwiseResult}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`;
  const params = attemptId ? { attemptId } : {};
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChapterwiseResultApi = async (
  studentId: number,
  testType: number,
  testId: number,
  streamId: number,
  standardId: number,
  attemptId: string
): Promise<any> => {
  const url = `${API_BASE_URL}/${Apipoint.getChapterwiseResult}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`;
  const params = attemptId ? { attemptId } : {};
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConceptwiseResultApi = async (
  studentId: number,
  testType: number,
  testId: number,
  streamId: number,
  standardId: number,
  attemptId: string
) => {
  const url = `${API_BASE_URL}/${Apipoint.conceptWiseAnalysis}/${studentId}/${testType}/${testId}/${streamId}/${standardId}`;
  const params = attemptId ? { attemptId } : {};
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
