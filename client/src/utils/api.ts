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

// Swap API functions
export interface SwapRequest {
  _id: string;
  requesterId: string;
  requester: {
    _id: string;
    username: string;
    email: string;
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
  };
  recipientId: string;
  recipient: {
    _id: string;
    username: string;
    email: string;
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
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export const getSwapRequest = async (swapId: string): Promise<SwapRequest> => {
  const response = await api.get(`/swaps/${swapId}`);
  return response.data.data;
};

// Mock swap requests for demonstration
export const getMockSwapRequests = (): SwapRequest[] => {
  return [  
    {
      _id: '687235a1aea40ec25f8655',
      requesterId: '687235a1aea40ec25f8651',
      requester: {
        _id: '687235a1aea40ec25f8651',
        username: 'testuser2',
        email: 'john.smith@example.com',
        profilePhoto: '',
        skillsOffered: [
          { _id: '1', name: 'JavaScript', category: 'Programming' },
          { _id: '2', name: 'React', category: 'Frontend' },
          { _id: '3', name: 'Node.js', category: 'Backend' }
        ],
        skillsWanted: [
          { _id: '4', name: 'Python', category: 'Programming' },
          { _id: '5', name: 'Machine Learning', category: 'AI' }
        ]
      },
      recipientId: '687235a1aea40ec25f8652',
      recipient: {
        _id: '687235a1aea40ec25f8652',
        username: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
        skillsOffered: [
          { _id: '6', name: 'Python', category: 'Programming' },
          { _id: '7', name: 'Data Science', category: 'Analytics' },
          { _id: '8', name: 'Machine Learning', category: 'AI' }
        ],
        skillsWanted: [
          { _id: '9', name: 'React', category: 'Frontend' },
          { _id: '10', name: 'JavaScript', category: 'Programming' }
        ]
      },
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '687235a1aea40ec25f8656',
      requesterId: '687235a1aea40ec25f8653',
      requester: {
        _id: '687235a1aea40ec25f8653',
        username: 'Mike Chen',
        email: 'mike.chen@example.com',
        profilePhoto: 'https://randomuser.me/api/portraits/men/45.jpg',
        skillsOffered: [
          { _id: '11', name: 'UI/UX Design', category: 'Design' },
          { _id: '12', name: 'Figma', category: 'Design Tools' },
          { _id: '13', name: 'Adobe Photoshop', category: 'Design Tools' }
        ],
        skillsWanted: [
          { _id: '14', name: 'Web Development', category: 'Programming' },
          { _id: '15', name: 'HTML/CSS', category: 'Frontend' }
        ]
      },
      recipientId: '687235a1aea40ec25f8654',
      recipient: {
        _id: '687235a1aea40ec25f8654',
        username: 'Emily Davis',
        email: 'emily.davis@example.com',
        profilePhoto: 'https://randomuser.me/api/portraits/women/46.jpg',
        skillsOffered: [
          { _id: '16', name: 'HTML/CSS', category: 'Frontend' },
          { _id: '17', name: 'Web Development', category: 'Programming' },
          { _id: '18', name: 'Bootstrap', category: 'Frontend' }
        ],
        skillsWanted: [
          { _id: '19', name: 'UI/UX Design', category: 'Design' },
          { _id: '20', name: 'Figma', category: 'Design Tools' }
        ]
      },
      status: 'accepted',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      _id: '687235a1aea40ec25f8657',
      requesterId: '687235a1aea40ec25f8655',
      requester: {
        _id: '687235a1aea40ec25f8655',
        username: 'Alex Rodriguez',
        email: 'alex.rodriguez@example.com',
        profilePhoto: 'https://randomuser.me/api/portraits/men/47.jpg',
        skillsOffered: [
          { _id: '21', name: 'Java', category: 'Programming' },
          { _id: '22', name: 'Spring Boot', category: 'Backend' },
          { _id: '23', name: 'Database Design', category: 'Database' }
        ],
        skillsWanted: [
          { _id: '24', name: 'Mobile Development', category: 'Programming' },
          { _id: '25', name: 'React Native', category: 'Mobile' }
        ]
      },
      recipientId: '687235a1aea40ec25f8656',
      recipient: {
        _id: '687235a1aea40ec25f8656',
        username: 'Lisa Wang',
        email: 'lisa.wang@example.com',
        profilePhoto: 'https://randomuser.me/api/portraits/women/48.jpg',
        skillsOffered: [
          { _id: '26', name: 'React Native', category: 'Mobile' },
          { _id: '27', name: 'Mobile Development', category: 'Programming' },
          { _id: '28', name: 'iOS Development', category: 'Mobile' }
        ],
        skillsWanted: [
          { _id: '29', name: 'Java', category: 'Programming' },
          { _id: '30', name: 'Spring Boot', category: 'Backend' }
        ]
      },
      status: 'rejected',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-14T11:30:00Z'
    }
  ];
};