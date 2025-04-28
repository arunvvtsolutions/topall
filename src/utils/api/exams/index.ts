import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import { GetUsageHistory } from '@/types/exams';
import axios from '@/utils/axios';

//API for pin exams
export const pinAndUnpinExams = async (id: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.pinAndUnpinExams}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//API for  sections/allSections
export const getsectionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSections}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

// API for deleting an exam
export const deleteExam = async (examId: number | null) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deleteExam}/${examId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API for getting a singlesectionTest test by ID
export const getSinglesectionTest = async (testId: number, sectionId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSingleSections}/${testId}/${sectionId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a list of chapters
export const getChapterList = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getChapterList}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting view questions
export const getViewQuestions = async (sectionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getViewQuestions}/${sectionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API for getting a single addQuestionList
export const addQuestionList = async (data?: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.importQuestionList}`, { ...data });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a list of topics
export const getTopicList = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getTopicList}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for update questions order
export const updateQuestionsOrder = async (payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateQuestionsOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a list of questions model
export const getQuestionModel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getQuestionModel}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for delete questions
export const deleteQuestions = async (payload: any) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deleteQuestions}`, { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for searching questions
export const searchQuestion = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.searchQuestion}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for adding questions
export const addQuestions = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.addQuestions}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a single section
export const getSingleSection = async (examId: number, sectionId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSingleSection}/${examId}/${sectionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for get usage history
export const getUsageHistory = async (questionId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getUsageHistory}/${questionId}`);
    return response.data as GetUsageHistory;
  } catch (error) {
    throw error;
  }
};

// API for update report issue
export const updateReportIssue = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.reportIssue}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getting a syllabus details
export const getSyllabusById = async (examId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSyllabus}/${examId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for update a previousYearTest
export const previousYearTest = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.previousYear}`, payload);
    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};
// API for getting a syllabus details
export const changePublishStatus = async (examId: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.publishStatus}/${examId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
