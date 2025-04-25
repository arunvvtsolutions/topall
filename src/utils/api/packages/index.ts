import { API_BASE_URL } from '@/config';
import Apipoint, { PackagePlanPayload } from '@/types/enum';
import axios from '@/utils/axios';

// Full API response type

export const createPackage = async (payload: PackagePlanPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createPackage}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePackagePlan = async (planID: number, payload: { name: string; description: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updatePackagePlan}/${planID}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePackagePlan = async (planID: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deletePackagePlan}/${planID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const archiveUnarchivePackagePlan = async (planID: number) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${Apipoint.archiveUnarchivePackagePlan}/${planID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSinglePackagePlan = async (planID: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSinglePackagePlan}/${planID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const gerDurationType = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.durationType}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTestPlan = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createTestPlan}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTestPlans = async (planID: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTestPlans}/${planID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createChapterTestPlan = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createChapterTestPlan}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConceptTestPlan = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createConceptTestPlan}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
