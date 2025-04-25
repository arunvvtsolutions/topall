// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  concepts: [],
  error: null
};

// ==============================|| SLICE - ACADEMIC ||============================== //

const slice = createSlice({
  name: 'conceptTest',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    fetchConceptsSuccess(state, action) {
      state.concepts = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, fetchConceptsSuccess } = slice.actions;

//API for get standards
export function getConceptWishTest(subjectId:any, standardId:any, studentId:any, streamId:any) {
  return async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${Apipoint.getConcepts}/${subjectId}/${standardId}/${studentId}/${streamId}`
          );
      dispatch(slice.actions.fetchConceptsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
