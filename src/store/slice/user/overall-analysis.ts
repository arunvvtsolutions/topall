import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const initialState: DefaultRootStateProps['overAllAnalysis'] = {
  error: null,
  loading: false,
  subjectWiseAnalysis: null,
  weakerAreas: null,
  difficultyAnalysis: null,
  chapterConceptAnalysis: null,
  timeAnalysis: null
};

const slice = createSlice({
  name: 'overAllAnalysis',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSubjectWiseAnalysis(state, action) {
      state.subjectWiseAnalysis = action.payload;
      state.loading = false;
    },
    setWeakerAreaAnalysis(state, action) {
      state.weakerAreas = action.payload;
    },
    setDifficultyAnalysis(state, action) {
      state.difficultyAnalysis = action.payload;
    },
    setChapterConceptAnalysis(state, action) {
      state.chapterConceptAnalysis = action.payload;
    },
    setTimeAnalysis(state, action) {
      state.timeAnalysis = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  setSubjectWiseAnalysis,
  startLoading,
  hasError,
  setWeakerAreaAnalysis,
  setDifficultyAnalysis,
  setChapterConceptAnalysis,
  setTimeAnalysis
} = slice.actions;

export function fetchSubjectWiseAnalysis(studentId: number, streamId: number) {
  return async () => {
    dispatch(startLoading()); // Set loading state before API call
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.overallSubjectWiseAnalysis}/${studentId}/${streamId}`);
      dispatch(setSubjectWiseAnalysis(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function fetchWeakerAreaAnalysis(studentId: number, streamId: number, subjectId: number) {
  return async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${Apipoint.overallWeakerAreaAnalysis}/${studentId}/${streamId}/${subjectId}`
      );
      dispatch(setWeakerAreaAnalysis(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function fetchDifficultyAnalysis(studentId: number, streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.difficultyAnalysis}/${studentId}/${streamId}`);
      dispatch(setDifficultyAnalysis(response.data.formattedSubjectsList));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function fetchChapterConceptAnalysis(studentId: number, streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.chapterConceptAnalysis}/${studentId}/${streamId}`);
      dispatch(setChapterConceptAnalysis(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function fetchTimeAnalysis(studentId: number, streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.timeAnalysis}/${studentId}/${streamId}`);
      dispatch(setTimeAnalysis(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
