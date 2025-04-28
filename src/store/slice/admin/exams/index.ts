// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import Apipoint from '@/types/enum';
import { DefaultRootStateProps } from '@/types';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { GetExamPayload } from '@/types/exams';

export const initialFilters = { publishType: [], standardIds: [], streamIds: [], testTypeIds: [] };

// initial state
const initialState: DefaultRootStateProps['adminExams'] = {
  error: null,
  loading: false,
  examsList: null,
  examFilters: initialFilters,
  reportTypes: []
};

// ==============================|| SLICE - EXAMS ||============================== //

const slice = createSlice({
  name: 'adminExams',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setExamsListSuccess(state, action) {
      state.examsList = action.payload;
    },
    setExamFiltersSuccess(state, action) {
      state.examFilters = action.payload;
    },
    setReportTypesSuccess(state, action) {
      state.reportTypes = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, setExamsListSuccess, setExamFiltersSuccess } = slice.actions;

//API for get exams
export function getExams(payload: GetExamPayload) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post(`${API_BASE_URL}/${Apipoint.getExams}`, payload);
      if (response?.data) dispatch(slice.actions.setExamsListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };
}

// API for filtered Exams
export function filteredExams(payload: any) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await axios.post(`${API_BASE_URL}/${Apipoint.filteredExam}`, payload);
      if (response?.data) dispatch(slice.actions.setExamsListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };
}

// API for get report types
export function getReportTypes() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getReportTypes}`);
      if (response?.data) dispatch(slice.actions.setReportTypesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}
