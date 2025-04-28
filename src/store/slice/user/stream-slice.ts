import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps, GenericType } from '@/types';
import { hasError } from '../auth';
import { getLocalStorageData, setLocalStorage } from '@/utils';

const intitialState: DefaultRootStateProps['stream'] = {
  error: null,
  stream: typeof window !== 'undefined' ? getLocalStorageData('stream') : null,
  standard: typeof window !== 'undefined' ? getLocalStorageData('stream') : null
};

const slice = createSlice({
  name: 'stream',
  initialState: intitialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setStreamSelectionSuccess(state, action) {
      const { stream, standards } = action.payload;
      const matchedStandard = standards?.find((std: any) => std?.streamId === stream?.id);
      const standard = matchedStandard ? matchedStandard.standard : null;
      state.stream = stream;
      state.standard = standard;

      // Only run on client side
      if (typeof window !== 'undefined') {
        setLocalStorage('stream', JSON.stringify(stream));
        setLocalStorage('standard', JSON.stringify(standard));
      }
    }
  }
});

export default slice.reducer;

export const { setStreamSelectionSuccess } = slice.actions;
