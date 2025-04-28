import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

export const getReferralUsedCounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReferralUsedCounts}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReferralBenefitsList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReferralBenefitsList}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReferralBenefitsHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReferralBenefitsHistory}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReferralLevels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReferralLevels}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReferralBenefitsById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReferralBenefits}/${id}`);
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

export const createReferral = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createReferral}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReferral = async (id: number, payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateReferral}/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReferral = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deleteReferral}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
