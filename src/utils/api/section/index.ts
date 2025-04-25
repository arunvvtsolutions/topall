import { API_BASE_URL } from '@/config';

import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { getStreamById } from '../academic';
export const updateSection = async (payload: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${Apipoint.sectionsUpdate}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
// API function
export const updateSectionSequence = async (examId: string, sequence: string[]): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateSectionSequence}/${examId}`, {
      sequence,
    });
      return response.data;
  } catch (error) {
    throw error;
  }
};
  // API for deleting a section
  export const deleteSection = async (examId: string, sectionId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${Apipoint.sectionsDelete}/${examId}/${sectionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // API for creating a section
  export const createSection = async (payload: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${Apipoint.sectionsCreate}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const getSectionEditById = async (examId: string, sectionId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.singleSection}/${examId}/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error( error);
      throw error;
    }
  };
  export const getExamStreamById = async (examId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}/${examId}`);
      return response.data;
    } catch (error) {
      console.error( error);
      throw error;
    }
  };
  
  