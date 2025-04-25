import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { hasError } from './selectors';

const initialState: DefaultRootStateProps['packages'] = {
  error: null,
  packages: [],
  chapterData: []
};

const slice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setPackagePlan(state, action) {
      state.packages = action.payload;
    },
    setChapterData(state, action) {
      state.chapterData = action.payload;
    }
  }
});

export default slice.reducer;

export const { setPackagePlan } = slice.actions;

export function getPackagePlan() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.packagePlan}`);
      if (response.data) dispatch(slice.actions.setPackagePlan(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getChapterData(streamID: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.chapterPreData}/${streamID}`);
      if (response.data) dispatch(slice.actions.setChapterData(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
