import { API_BASE_URL } from '@/config';
import axios from 'axios';
import Apipoint from '@/types/enum';

// GET API For Fetching All The Carousels
export const fetchCarouselList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.carouselList}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API For Creating Carousel
export const createCarousel = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${Apipoint.createCarousel}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT API For Updating a Carousel
export const updateCarousel = async (payload: any, carouselID: number) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateCarousel}/${carouselID}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE API For Deleting a Carousel
export const deleteCarousel = async (carouselID: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${Apipoint.deleteCarousel}/${carouselID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT API For Changing The Order Of The Carousel
export const changeCarouselOrder = async (payload: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateCarouselOrder}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET API For Fetching Single Carousel
export const fetchSingleCarousel = async (carouselID: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSingleCarousel}/${carouselID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
