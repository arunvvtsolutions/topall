import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

interface ChapterWiseTestsParams {
  subjectId: number | null;
  standardId: number | null;
  studentId: number | null;
  streamId: number | null;
}

// API to fetch chapter-wise tests based on subject, standard, student, and stream
export const getChapterWiseTests = async (params: ChapterWiseTestsParams) => {
  const { subjectId, standardId, studentId, streamId } = params;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/${Apipoint.chapterWiseTests}/${subjectId}/${standardId}/${studentId}/${streamId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chapter-wise tests:', error);
    throw error;
  }
};

// GET API for fetching the level list
export const getLevelList = async (streamId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getLevelList}/${streamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API for starting a chapter-wise test
export const practiceChapterWiseTest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.practiceChapterWiseTest}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API for starting a concept-wise test
export const startConceptWiseTest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.startConceptWiseTest}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
