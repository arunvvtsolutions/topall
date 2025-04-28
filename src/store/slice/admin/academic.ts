// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { setStreamsSelectorSuccess, setSubjectsSelectorSuccess, setTesttypeSelectorSuccess } from './selectors';

// initial state
const initialState: DefaultRootStateProps['adminAcademic'] = {
  error: null,
  subjects: [],
  streams: [],
  standards: [],
  testtype: [],
  syllabusLink: {
    syllabusData: [],
    filtered: false
  },
  yearList:[],
  syllabus: null,
};

// ==============================|| SLICE - ACADEMIC ||============================== //

const slice = createSlice({
  name: 'academic',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setSubjectsSuccess(state, action) {
      state.subjects = action.payload;
    },
    setStreamsSuccess(state, action) {
      state.streams = action.payload;
    },
    setStandardsSuccess(state, action) {
      state.standards = action.payload;
    },
    setTesttypeSuccess(state, action) {
      state.testtype = action.payload;
    },
    setSyllabusLinkSuccess(state, action) {
      state.syllabusLink = {
        syllabusData: action.payload.data,
        filtered: action.payload.filtered
      };
    },
    setStandardSuccess(state, action) {
      state.standards = action.payload;
    },
    setSingleSyllabusSuccess(state, action) {
      state.syllabus = action.payload;
    },
    setYearListSuccess(state, action) {
      state.yearList = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, setSubjectsSuccess, setTesttypeSuccess, setStreamsSuccess,setYearListSuccess } = slice.actions;

//API for get subjects
export function getSubjects() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSubjects}`);
      if (response && response.data) {
        dispatch(slice.actions.setSubjectsSuccess(response.data));
        dispatch(setSubjectsSelectorSuccess(response.data));
      }
      dispatch(slice.actions.setSubjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getStreams() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getStreams}`);
      if (response?.data) {
        dispatch(slice.actions.setStreamsSuccess(response.data));
        dispatch(setStreamsSelectorSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTesttype() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTesttype}`);
      if (response?.data) {
        dispatch(slice.actions.setTesttypeSuccess(response.data));
        dispatch(setTesttypeSelectorSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//API for get syllabuses
export function getSyllabusLink() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.syllabus}`);
      dispatch(slice.actions.setSyllabusLinkSuccess({ data: response.data, filtered: false }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// API for filtering syllabus link
export function filterSyllabusLink(streamId: number, standardId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.filterSyllabus}/${streamId}/${standardId}`);
      dispatch(slice.actions.setSyllabusLinkSuccess({ data: response.data, filtered: true }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//API for fetching standards
export function getStandards() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.standard}`);
      dispatch(slice.actions.setStandardSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// API for view Single Syllabus
export function getSingleSyllabus(courseSubjectId?: number, standardId?: number, qbSubjectId?: number) {
  return async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${Apipoint.syllabus}/${Apipoint.viewSingleSyllabus}/${courseSubjectId}/${standardId}/${qbSubjectId}`
      );
      dispatch(slice.actions.setSingleSyllabusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getYearList() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getYearList}`);
      if (response?.data) {
        dispatch(slice.actions.setYearListSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
