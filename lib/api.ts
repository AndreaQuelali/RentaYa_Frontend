import axios from 'axios';
import {storage} from './storage';

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',    
    },
    timeout: 10_000,
});

api.interceptors.request.use(
    async (config) => {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
},
    (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try{
                const refreshToken = await storage.getRefreshToken();
                if(refreshToken) {
                    const response = await axios.post(
  `${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken } = response.data.data;
          await storage.setToken(accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await storage.clear();
      }
    }
    
    return Promise.reject(error);
  }
);