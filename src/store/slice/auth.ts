// types
import { DefaultRootStateProps } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState: DefaultRootStateProps['autendication'] = {
  error: null,
  user: '',
  role: 'student'
};

// ==============================|| SLICE - auth ||============================== //
const slice = createSlice({
  name: 'autendication',
  initialState,
  reducers: {
    // has error
    hasError(state, action) {
      state.error = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    }
  }
});

export default slice.reducer;

export const { hasError, setRole } = slice.actions;
