import { API_BASE_URL } from '@/config';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';

export const addBookmark = async (payload: { questionId: number; studentId: number; testType: number; bookmarkType: number }) => {
  try {
    const result = await axios.post(`${API_BASE_URL}/${Apipoint.addBookmark}`, payload);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getBookmarkTypes = async () => {
  try {
    const result = await axios.get(`${API_BASE_URL}/${Apipoint.getBookmarkTypes}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getBookmarks = async (payload: { studentId: number; bookmarkType: number }) => {
  try {
    const result = await axios.post(`${API_BASE_URL}/${Apipoint.getBookmarks}`, payload);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBookmark = async (payload: { questionId: number; studentId: number; bookmarkType: number }) => {
  try {
    const result = await axios.post(`${API_BASE_URL}/${Apipoint.deleteBookmark}`, payload);
    return result;
  } catch (error) {
    throw error;
  }
};
