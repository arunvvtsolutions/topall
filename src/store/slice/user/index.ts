import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import Apipoint, { TosterMessages } from '@/types/enum';
import { DefaultRootStateProps, QBSubjects, Subject, Streams, Testtype, Standard } from '@/types';
import axios from '@/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { hasError } from '../admin/selectors';
import { getSelectedStreamSubject } from '@/utils/api/user';

const initialState: DefaultRootStateProps['user'] = {
  error: null,
  userId: null,
  streams: [],
  standard: {
    id: 0,
    name: ''
  },
  subjects: [],
  profile: {
    name: '',
    email: null,
    phone: '',
    gender: '',
    dob: '',
    standard: null as any,
    role: '',
    address: '',
    country: '',
    state: 0,
    city: null,
    zip_code: '',
    currentExams: [],
    referLevel: 0
  }
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setStreamsSuccess(state, action) {
      state.streams = action.payload;
    },
    setUserIdSuccess(state, action) {
      state.userId = action.payload;
    },
    setStandardSuccess(state, action) {
      state.standard = action.payload;
    },
    setSelectedStreamSubjects(state, action) {
      state.subjects = action.payload;
    },
    setProfileDetailsSucess(state, action) {
      state.profile = action.payload;
    }
  }
});

export default slice.reducer;

export const { setStreamsSuccess, setUserIdSuccess, setStandardSuccess, setSelectedStreamSubjects, setProfileDetailsSucess } =
  slice.actions;

// API for setting the subjects based on the selected stream
export const setStreamSelection = async (streamId: number) => {
  try {
    const selectedStream = await getSelectedStreamSubject(streamId);
    const convertedSubjects = selectedStream.stream_subjects.map((subject: any) => {
      return { id: subject.subject_id, name: subject.subjectName };
    });
    dispatch(setSelectedStreamSubjects(convertedSubjects));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
