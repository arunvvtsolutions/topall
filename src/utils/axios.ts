import axios from 'axios';
import { getCookie } from '.';

const axiosInterceptorInstance = axios.create();

// interceptor for http
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    const userToken = getCookie('next-auth.session-token');
    if (userToken  && config.headers) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;
