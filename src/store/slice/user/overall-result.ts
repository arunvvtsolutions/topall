// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState: DefaultRootStateProps['overAllResult'] = {
  overallResult: null,
  timeAnalysis: [],
  difficultyStats: [],
  leaderboard: [],
  error: null
};

// ==============================|| SLICE - ACADEMIC ||============================== //

const slice = createSlice({
  name: 'overAllResult',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    getOverallResultSuccess(state, action) {
      state.overallResult = action.payload;
    },
    getTimeAnalysisSuccess(state, action) {
      state.timeAnalysis = action.payload;
    },
    getDifficultyStatsSuccess(state, action) {
      state.difficultyStats = action.payload;
    },
    getLeaderBoardSuccess(state, action) {
      state.leaderboard = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, getOverallResultSuccess, getTimeAnalysisSuccess, getDifficultyStatsSuccess } = slice.actions;

//API for get overall result
export function getOverallResult(payload: any) {
  const url = `${API_BASE_URL}/${Apipoint.getOverallResult}/${payload.studentId}/${payload.testType}/${payload.testId}/${payload.streamId}/${payload.standardId}`;
  const params = payload.attemptId ? { attemptId: payload.attemptId } : {};
  return async () => {
    try {
      const response = await axios.get(url, { params });
      if (response && response.data.data) dispatch(getOverallResultSuccess(response.data.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getTimeAnalysis(payload: any) {
  return async () => {
    const url = `${API_BASE_URL}/${Apipoint.getTimeAnalysis}/${payload.studentId}/${payload.testType}/${payload.testId}/${payload.streamId}/${payload.standardId}`;
    const params = payload.attemptId ? { attemptId: payload.attemptId } : {};
    try {
      const response = await axios.get(url, { params });
      dispatch(getTimeAnalysisSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getDifficultyStats(studentId: string, testType: string, testId: string, streamId: number, attemptId: string) {
  return async () => {
    const url = `${API_BASE_URL}/${Apipoint.getDifficultyStats}/${studentId}/${testType}/${testId}/${streamId}`;
    const params = attemptId ? { attemptId } : {};
    try {
      const response = await axios.get(url, { params });
      if (response && response.data) dispatch(getDifficultyStatsSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

//API for get leaderboard
export function getLeaderboard(testId: number, streamId: number, testType: number, studentId: number) {
  return async () => {
    const url = `${API_BASE_URL}/${Apipoint.getLeaderboard}/${testId}/${streamId}/${testType}/${studentId}`;

    try {
      const response = await axios.get(url);
      if (response?.data && Array.isArray(response.data)) {
        const uniqueLeaderboard = removeDuplicatesById(response.data);
        dispatch(slice.actions.getLeaderBoardSuccess(uniqueLeaderboard));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//remove duplicates id
function removeDuplicatesById(data: any[]): any[] {
  const seen = new Set();
  return data.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
