import { API_BASE_URL } from '@/config';
import { PaymentDetails } from '@/types';
import Apipoint from '@/types/enum';
import axios from 'axios';

export const postPaymentDetails = async (data: PaymentDetails) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.postPaymentDetails}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
