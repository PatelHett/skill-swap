// src/types/auth.ts
export interface User {
    id: string;
    name: string;
    email: string;
    location?: string;
    profilePhoto?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
    isPublic: boolean;
    createdAt: string;
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
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }