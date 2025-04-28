import { API_BASE_URL } from '@/config';
import { LogoutPayload, VerfiedUserResponse, VerfiyOtpPayload } from '@/types/auth';
import Apipoint from '@/types/enum';
import axios from 'axios';

// API for get otp
export const getOtp = async (mobileNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getOtp}/${mobileNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for verify otp
export const verifyOtp = async (
  payload: VerfiyOtpPayload
): Promise<{ success: boolean; message: string; user: VerfiedUserResponse }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.verifyOtp}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API for get ip details
export const getIpDetails = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_IP_URL}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const studentLogout = async (payload: LogoutPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.verifyOtp}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccessToken = async (refreshToken: string): Promise<{ success: boolean; accessToken: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.refreshToken}`, { refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (accessToken: string): Promise<VerfiedUserResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.user}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    // console.log(error, "ERROR");

    throw error;
  }
};
