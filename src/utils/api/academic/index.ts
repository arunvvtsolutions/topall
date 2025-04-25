import { API_BASE_URL } from '@/config';
import { ChapterTopics, StreamPayload } from '@/types';

import { SubjectPayload } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

// API for update subjects order
export const updateSubjectOrder = async (payload: SubjectPayload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateSubjectOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for standard reorder
export const updateStandardOrder = async (payload: any) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.updatStandardOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API For TestType Dropdown
export const fetchTestTypeItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTestTypeDropdown}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for add subjects
export const addSubject = async (payload: SubjectPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getSubjects}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for add testtype
export const addTesttype = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getTesttype}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for update subjects
export const updateSubject = async (id: number, payload: SubjectPayload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.getSubjects}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//API FOR CREATE testype
export const createTesttype = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getTesttype}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTesttype = async (payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.getTesttype}/${payload.id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API for delete subjects order
export const deleteSubject = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.getSubjects}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for creating standard
export const createStandard = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.standards}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for updating standard
export const updateStandard = async (id: number, payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.standards}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for deleting standard
export const deleteStandard = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.standards}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for update testtype
export const updateTesttypeSequence = async (data: number[]) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.updateTesttype}`, data);
    // API for update stream order
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for add stream
export const addStream = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getStreams}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getbyId stream
export const getStreamById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for update stream
export const updateStream = async (id:number,payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.getStreams}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API For Getting The Image Path
export const imageUpload = async (file: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.uploadImage}`, file);
    return response;
  } catch (error) {
    // toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
    throw error;
  }
};

export const updateStreamOrder = async (payload: StreamPayload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateStreamOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for getbyId Testtype
export const getTestById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTesttype}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for delete stream  order
export const deleteStream = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.getStreams}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API for delete Testtype order

// API For Getting The Image Path

export const deleteTesttype = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.getTesttype}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API for toggle Testtype order
export const testTypeStatusToggle = async (id: number, data: { leaderBoardStatus: boolean }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.lederboardTesttype}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for get Syllabus Chapters
export const getSyllabusChapters = async (courseSubId: number, stdId: number, qbSubId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSyllabusChapters}/${courseSubId}/${stdId}/${qbSubId}`);
    return response.data as ChapterTopics;
  } catch (error) {
    throw error;
  }
};

// API for update Syllabus Chapters
export const updateSyllabusChapters = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.updateSyllabusChapters}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for syllabus sequence order
export const updateSyllabusLinkOrder = async (payload: number[]) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.syllabusOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for syllabus chapter and topic sequence order
export const updateSyllabusChapterTopicsOrder = async (subjectId: number, standardId: number, payload: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${Apipoint.syllabus}/${Apipoint.updateSingleSyllabusSequenceOrder}/${subjectId}/${standardId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//API for update Test type instructions
export const updateTesttypeInstruction = async (id: number, payload: any) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.updateTesttypeInstruction}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//AcademicYear to create list
export const createYearList = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.creatYearList}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//AcademicYear list by Id API
export const getYearListById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getYearListById}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//AcademicYear to update
export const updateYearListById = async (id: number, payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateYearList}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//AcademicYear to delete
export const deleteYearListById = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.updateYearList}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
