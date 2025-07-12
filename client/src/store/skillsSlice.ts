// src/store/skillsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

interface Skill {
  _id: string;
  skillId: string;
  name: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SkillsState {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SkillsState = {
  skills: [],
  isLoading: false,
  error: null,
};

// Fetch all skills
export const fetchAllSkills = createAsyncThunk(
  'skills/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/skills'); // Get all skills
      return response.data.data.skills;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload;
        state.error = null;
      })
      .addCase(fetchAllSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = skillsSlice.actions;
export default skillsSlice.reducer;