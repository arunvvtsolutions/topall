import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import { Errors } from '@/types/enum';
import { getProfileDetail } from '@/utils/api/user';
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState: DefaultRootStateProps['userProfile'] = {
  userId: null,
  joinedData: '',
  name: '',
  mobileNumber: '',
  email: '',
  onBoardData: false,
  currentExams: [],
  userTimeZone: '',
  loginCountry: '',
  uuidNumber: '',
  referalCode: '',
  lastLoginTime: '',
  lastLogoutTime: null,
  profileImage: '',
  target: [],
  isActive: true,
  loginDevice: '',
  role: {
    id: 0,
    role: '',
    name: '',
    avatar: '',
    isActive: true
  },
  dob: '',
  state: 0,
  city: 0,
  referLevel: 0,
  standard: [],
  address: '',
  zipCode: '',
  gender: '',
  best: null,
  testExpiry: null,
  daysExpiry: null
};

const slice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserProfileSuccess(state, action) {
      state.userId = action.payload.userId;
      state.joinedData = action.payload.joinedData;
      state.name = action.payload.name || action.payload.userName;
      state.mobileNumber = action.payload.mobileNumber;
      state.email = action.payload.email;
      state.onBoardData = action.payload.onBoardData;
      state.currentExams = action.payload.currentExams;
      state.userTimeZone = action.payload.userTimeZone;
      state.loginCountry = action.payload.loginCountry;
      state.uuidNumber = action.payload.uuidNumber;
      state.referalCode = action.payload.referalCode;
      state.lastLoginTime = action.payload.lastLoginTime;
      state.lastLogoutTime = action.payload.lastLogoutTime;
      state.profileImage = action.payload.profileImage;
      state.target = action.payload.target;
      state.isActive = action.payload.isActive;
      state.loginDevice = action.payload.loginDevice;
      state.role = action.payload.role;
      state.dob = action.payload.dob;
      state.state = action.payload.state;
      state.city = action.payload.city;
      state.referLevel = action.payload.referLevel;
      state.standard = action.payload.standard;
      state.address = action.payload.address;
      state.zipCode = action.payload.zipCode;
      state.gender = action.payload.gender;
      state.best = action.payload.best;
      state.testExpiry = action.payload.testExpiry;
      state.daysExpiry = action.payload.daysExpiry;
    }
  }
});

export default slice.reducer;

export const { setUserProfileSuccess } = slice.actions;

export const getUserProfile = async (mobileNumber: string) => {
  try {
    const response = await getProfileDetail(mobileNumber);
    if (response) dispatch(slice.actions.setUserProfileSuccess(response));
  } catch (error) {
    toast.error(Errors.SOMETHING_WENT_WRONG);
  }
};

// // API for setting the subjects based on the selected stream
// export const setStreamSelection = async (streamId: number) => {
//   try {
//     const selectedStream = await getSelectedStreamSubject(streamId);
//     const convertedSubjects = selectedStream.stream_subjects.map((subject: any) => {
//       return { id: subject.subject_id, name: subject.subjectName };
//     });
//     dispatch(setSelectedStreamSubjects(convertedSubjects));
//   } catch (error) {
//     dispatch(slice.actions.hasError(error));
//   }
// };
