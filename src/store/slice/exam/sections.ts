import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import Apipoint from '@/types/enum';

interface Section {
  id: string;
  examId: string;
  name: string;
  sequence: number;
  maxAttempts: number;
  cMark: number;
  wMark: number;
  lMark: number;
  totalQuestions: number;
  questionType: number;
  staffId: number;
  subjectId: number;
  totalMark: number;
  subjectName: string;
  questionList: number[];
  reusedQuestionCount: number;
}

interface SectionState {
  sections: Section[];
  faculties: Faculty[];
  error: string | null;
}
interface Faculty {
  id: number;
  name: string;
}


const initialState: SectionState = {
  sections: [],
  faculties: [],
  error: null,
};

const sectionSlice = createSlice({
  name: 'examSections',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setSectionsSuccess(state, action: PayloadAction<Section[]>) {
      state.sections = action.payload;
      state.error = null;
    },

    setFaculties(state, action: PayloadAction<Faculty[]>) {
      state.faculties = action.payload; 
      state.error = null;
    },
  },
});

export default sectionSlice.reducer;

export const { setSectionsSuccess, hasError } = sectionSlice.actions;

export function getSectionsByExamId(examId: string) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.sectionsList}/${examId}`);
      if (response?.data) {
        dispatch(sectionSlice.actions.setSectionsSuccess(response.data));
      }
    } catch (error) {
      dispatch(sectionSlice.actions.hasError(error));
    }
  };
}

export function updateSectionSequence({ examId, sequence }: { examId: string; sequence: string[] }) {
  return async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${Apipoint.updateSectionSequence}/${examId}`, {
        sequence,
      });
      if (response?.data) {
        dispatch(getSectionsByExamId(examId) );
      }
      return response
    } catch (error) {
      dispatch(sectionSlice.actions.hasError(error));
    }
  };
}

export function getAllFaculty(examId: string) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.allFaculty}/${examId}`);
      if (response?.data) {
        dispatch(sectionSlice.actions.setFaculties(response.data)); 
      }
    } catch (error: any) {
      dispatch(sectionSlice.actions.hasError(error.message));
    }
  };
}

