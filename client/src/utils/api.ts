// src/utils/api.ts
import axios from 'axios';
import { store } from '../store/store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      store.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Users API functions
export interface User {
  _id: string;
  username: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Array<{
    _id: string;
    name: string;
    category: string;
  }>;
  skillsWanted: Array<{
    _id: string;
    name: string;
    category: string;
  }>;
  availability: string;
  isPublic: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  availability?: string;
}): Promise<UsersResponse> => {
  const response = await api.get('/users', { params });
  return response.data.data;
};