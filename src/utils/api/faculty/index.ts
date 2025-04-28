import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

export const getFacultyById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getFacultyById}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFaculty = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.getFacultyList}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFaculty = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createFaculty}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFaculty = async (id: number,payload:any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateFaculty}/${id}`,payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFacultyActiveStatus = async (id: number) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateFacultyActiveStatus}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFaculty = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deleteFaculty}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
