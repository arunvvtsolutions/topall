import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import { ProfilePayload } from '@/types/user';
import axios, { HttpStatusCode } from 'axios';

export const updateOnboard = async (payload: ProfilePayload): Promise<{ statusCode: HttpStatusCode; message: string }> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateOnboard}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.states}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyReferralCode = async (referralCode: string): Promise<{ isVerify: boolean }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.verifyReferral}/${referralCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStandards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.standard}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStreams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};