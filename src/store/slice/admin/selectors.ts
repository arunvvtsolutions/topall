// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import Apipoint, { TosterMessages } from '@/types/enum';
import { DefaultRootStateProps, QBSubjects, Subject, Streams, Testtype, Standard } from '@/types';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState: DefaultRootStateProps['selectors'] = {
  error: null,
  streams: [],
  subjects: [],
  standards: [],
  qbSubjects: [],
  testTypes: [],
  packages: []
};

// ==============================|| SLICE - ACADEMIC ||============================== //

const slice = createSlice({
  name: 'academicSelectors',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setStreamsSelectorSuccess(state, action) {
      state.streams = action.payload
        .filter((item: Streams) => item.is_active)
        .map((item: Streams) => ({ id: item.id, name: item.name }));
    },
    setSubjectsSelectorSuccess(state, action) {
      state.subjects = action.payload
        .filter((item: Subject) => item.is_active)
        .map((item: Subject) => ({ id: item.id, name: item.name }));
    },
    setStandardSelectorsSuccess(state, action) {
      state.standards = action.payload
        .filter((std: Standard) => std.is_active)
        .map((std: Standard) => ({ id: std.id, name: std.name }));
    },
    setQBSubjectsSuccess(state, action) {
      state.qbSubjects = action.payload.map((item: QBSubjects) => ({ id: item.qbSubjectId, name: item.qbSubject }));
    },
    setTesttypeSelectorSuccess(state, action) {
      state.testTypes = action.payload
        .filter((item: Testtype) => item.is_active && item.stream_id !== null)
        .map((item: Testtype) => ({ id: item.id, name: item.test_type_list.name }));
    },
    setPackagesSuccess(state, action) {
      state.packages = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  hasError,
  setStreamsSelectorSuccess,
  setSubjectsSelectorSuccess,
  setStandardSelectorsSuccess,
  setTesttypeSelectorSuccess
} = slice.actions;

//API for get standards
export function getStandardSelectors() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.standard}`);
      dispatch(slice.actions.setStandardSelectorsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//API for get Question Bank Subjects
export function getQBSubjects() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getQBSubjects}`);
      if (response?.data) dispatch(slice.actions.setQBSubjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// API for get packages
export function getPackages() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getPackages}`);
      dispatch(slice.actions.setPackagesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
