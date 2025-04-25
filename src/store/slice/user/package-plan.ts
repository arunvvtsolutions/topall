// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState: DefaultRootStateProps['userPackagePlan'] = {
  error: null,
  packagePlan: []
};

// ==============================|| SLICE - PACAKGE PLAN ||============================== //

const slice = createSlice({
  name: 'userPackagePlan',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    getUserPackagePlanSuccess(state, action) {
      state.packagePlan = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, getUserPackagePlanSuccess } = slice.actions;

//API for get packaage plan
export function getUserPackagePlan(streamId: number, standardId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getPackagePlan}/${streamId}/${standardId}`);
      if (response?.data) dispatch(slice.actions.getUserPackagePlanSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
