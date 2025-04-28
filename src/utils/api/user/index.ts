import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from 'axios';

// GET Function To Get The Main Subjects Based On The Stream
export const getSelectedStreamSubject = async (streamId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}/${streamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET Function To Get The Profile Details
export const getProfileDetail = async (mobile: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getProfileDetails}/${mobile}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileState = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getProfileState}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileCity = async (stateId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getProfileCity}/${stateId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putProfileDetails = async (profileData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateProfileDetails}`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
