import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

const initialState: DefaultRootStateProps['testType'] = {
  error: null,
  testTypes: []
};

const slice = createSlice({
  name: 'testType',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setTestTypeListSuccess(state, action) {
      state.testTypes = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, setTestTypeListSuccess } = slice.actions;

export function getTestTypeByStreamId(streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getTestTypeByStreamId}/${streamId}`);
      if (response?.data?.data) dispatch(slice.actions.setTestTypeListSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
