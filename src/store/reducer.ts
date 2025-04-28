// third-party
import { combineReducers } from 'redux';

// project imports
import academicReducer from './slice/admin/academic';
import academicSelectors from './slice/admin/selectors';
import adminExamsReducer from './slice/admin/exams';
import examSections from './slice/exam/sections';
import authendicationReducer from './slice/auth';
import conceptTest from './slice/user/concept';
import userReducer from './slice/user/index';
import streamReducer from './slice/user/stream-slice';
import userProfileReducer from './slice/user/userProfileSlice';
import onlineExaminationReducer from './slice/onlineExamSlice';
import overAllResultReducer from './slice/user/overall-result';
import overAllAnalysisReducer from './slice/user/overall-analysis';
import bookmarksReducer from './slice/user/bookmarks';
import rankingReducer from './slice/user/ranking';
import testTypeListReducer from './slice/user/testType';
import packagePlanReducer from './slice/admin/packages';
import userPackagePlanReducer from './slice/user/package-plan';
import previousChatSlice from './slice/ai/previousChatSlice';
import aiBotDataSlice from './slice/ai/botDataSlice';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  academic: academicReducer,
  adminExams: adminExamsReducer,
  selectors: academicSelectors,
  examSections: examSections,
  authendication: authendicationReducer,
  conceptTest: conceptTest,
  user: userReducer,
  userProfile: userProfileReducer,
  stream: streamReducer,
  onlineExamination: onlineExaminationReducer,
  overAllResult: overAllResultReducer,
  bookmarks: bookmarksReducer,
  ranking: rankingReducer,
  testTypes: testTypeListReducer,
  overAllAnallysis: overAllAnalysisReducer,
  packagePlan: packagePlanReducer,
  userPacakgePlan: userPackagePlanReducer,
  aiPreviousChats: previousChatSlice,
  aiBotData: aiBotDataSlice
});

export default reducer;
