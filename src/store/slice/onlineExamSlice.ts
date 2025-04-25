import { API_BASE_URL } from '@/config';
import { DefaultRootStateProps } from '@/types';
import axios from '@/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dispatch } from '..';
import Apipoint from '@/types/enum';
import { getTestById } from '@/utils/api/academic';
import { ALL_INDIA_MOCK_TEST } from '@/types/constants';

const initialState: DefaultRootStateProps['onlineExamination'] = {
  hasError: null,
  examStatus: [],
  examDetails: null,
  sectionsData: [],
  hasExamError: null,
  selectedSubject: null,
  currentSection: '',
  currentQuestion: '',
  attemptedQuestions: []
};

const slice = createSlice({
  name: 'onlineExamination',
  initialState,
  reducers: {
    setHasError: (state, action) => {
      state.hasError = action.payload;
    },
    setExamStatus: (state, action) => {
      state.examStatus = action.payload;
    },
    setExamDetails: (state, action) => {
      state.examDetails = action.payload;
    },
    setSectionsList: (state, action) => {
      state.sectionsData = action.payload;
    },
    sethasExamError: (state, action) => {
      state.hasExamError = action.payload;
    },
    setSelectedSubjects: (state, action) => {
      state.selectedSubject = action.payload;
    },
    setCurrentSection: (state, action) => {
      state.currentSection = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setAttemptedQuestions: (state, action) => {
      state.attemptedQuestions = action.payload;
    }
  }
});

export default slice.reducer;
export const {
  setHasError,
  setSelectedSubjects,
  setSectionsList,
  setCurrentSection,
  setCurrentQuestion,
  setAttemptedQuestions,
  setExamDetails,
  setExamStatus
} = slice.actions;

// get test details
export function getExamDetails(testId: string) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTestById}/${testId}`);
      // console.log('response', response);
      if (response && response.data) {
        const payload = await enrichTestDetails(response.data);
        dispatch(slice.actions.setExamDetails(payload));
      }
    } catch (error) {
      dispatch(slice.actions.setHasError(error));
    }
  };
}

//Get test status
export function getExamStatus(payload: any) {
  return async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${Apipoint.oeGetTestStatus}`, payload);
      if (response && response.data) dispatch(slice.actions.setExamStatus(response.data));
    } catch (error) {
      dispatch(slice.actions.setHasError(error));
    }
  };
}

// get test details
export function getGenerateTestDetails(testId: string) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getGenerateTestById}/${testId}`);
      // console.log('response', response);
      if (response && response.data) {
        const payload = await enrichTestDetails(response.data);
        dispatch(slice.actions.setExamDetails(payload));
      }
    } catch (error) {
      dispatch(slice.actions.setHasError(error));
    }
  };
}

// get chapterwise details
export function getChapterWiseDetails(testId: string) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getSingleChapterWiseTest}/${testId}`);
      // console.log('response', response);
      if (response && response.data) {
        const payload = await enrichTestDetails(response.data.data);
        dispatch(slice.actions.setExamDetails(payload));
      }
    } catch (error) {
      dispatch(slice.actions.setHasError(error));
    }
  };
}

// get chapterwise details
export function getConceptWiseDetails(
  studentId: number,
  streamId: number,
  subjectId: number,
  chapterId: number,
  topicId: number
) {
  return async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${Apipoint.getSingleConceptWiseTest}/${studentId}/${streamId}/${subjectId}/${chapterId}/${topicId}`
      );
      if (response && response.data) {
        const payload = await enrichTestDetails(response.data.data);
        dispatch(slice.actions.setExamDetails(payload));
      }
    } catch (error) {
      dispatch(slice.actions.setHasError(error));
    }
  };
}

//trasforming test details
const enrichTestDetails = async (data: any) => {
  const testTypeRes = await getTestById(data.testTypeId);

  return {
    ...data,
    testId: String(data.id ?? data.testId),
    name: data.name || data.topicName || `${data.chapterName}:${data.level?.name}`,
    marks: data.marks || data.totalMarks,
    duration: data.duration || data.totalTime,
    totalQuestions: data.totalQuestions || data.totalQuestion,
    onlineInstrcutions: testTypeRes[0]?.instructions || ''
  };
};
