// src/types/auth.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  profilePhoto?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: 'weekends' | 'weekdays' | 'evenings' | 'custom';
  isPublic: boolean;
  role: 'user' | 'admin';
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}