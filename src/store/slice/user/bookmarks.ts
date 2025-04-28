// types
import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState: DefaultRootStateProps['bookmarks'] = {
  error: null,
  bookMarkLists: [],
  bookMarkTypes: []
};

// ==============================|| SLICE - BOOKMARKS ||============================== //

const slice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setBookMarksSuccess(state, action) {
      state.bookMarkLists = action.payload;
    },
    setBookMarkTypesSuccess(state, action) {
      state.bookMarkTypes = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError } = slice.actions;

//API for get bookmarks
export function getBookmarks(payload: any) {
  return async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${Apipoint.getBookmarks}`, payload);
      if (response?.data) dispatch(slice.actions.setBookMarksSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

//API for get bookmarksTypes
export function getBookmarkTypes() {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.getBookmarkTypes}`);
      if (response?.data) dispatch(slice.actions.setBookMarkTypesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
