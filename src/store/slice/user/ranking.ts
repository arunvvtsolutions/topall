import { API_BASE_URL } from '@/config';
import { dispatch } from '@/store';
import { DefaultRootStateProps } from '@/types';
import Apipoint from '@/types/enum';
import axios from '@/utils/axios';
import { createSlice, current } from '@reduxjs/toolkit';

const initialState: DefaultRootStateProps['ranking'] = {
  error: null,
  questionwise: [],
  timewise: [],
  referralwise: [],
  regionalwise: []
};

const slice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    setQuestionWiseRanking(state, action) {
      state.questionwise = action.payload;
    },
    setTimewiseRanking(state, action) {
      state.timewise = action.payload;
    },
    setReferalwiseRanking(state, action) {
      state.referralwise = action.payload;
    },
    setRegionalRanking(state, action) {
      state.regionalwise = action.payload;
    }
  }
});

export default slice.reducer;

export const { setQuestionWiseRanking, setTimewiseRanking, setReferalwiseRanking, setRegionalRanking, hasError } = slice.actions;

// GET API For Fetching Question Wise Ranking
export function fetchQuestionWiseRanking(studentId: number, streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.questionwiseRank}/${studentId}/${streamId}/10`);
      if (response && response.data) {
        const rawData = response.data;

        const transformedData = {
          currentUser:
            rawData?.currentUserRank && rawData?.currentUserRank.length > 0
              ? {
                  total: rawData.currentUserRank[0].totalQuestions,
                  rank: Number(rawData.currentUserRank[0].rank)
                }
              : {},
          type: 'question-wise',
          ranks: Array.isArray(rawData?.ranks)
            ? rawData.ranks.map((user: any) => ({
                name: user?.name,
                image_url: user?.image_url,
                total: Number(user?.totalQuestions)
              }))
            : []
        };
        dispatch(setQuestionWiseRanking(transformedData));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// GET API For Fetching Time Wise Ranking
export function fetchTimewiseRanking(studentId: number, streamId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.timewiseRank}/${studentId}/${streamId}/10`);

      if (response && response.data) {
        const rawData = response.data;

        const transformedTime = {
          currentUser:
            rawData?.currentUserRank && rawData?.currentUserRank.length > 0
              ? {
                  total: rawData.currentUserRank[0].totalTimeSpent,
                  rank: Number(rawData.currentUserRank[0].rank)
                }
              : {},
          type: 'time-wise',
          ranks: Array.isArray(rawData?.ranks)
            ? rawData.ranks.map((user: any) => ({
                name: user.name,
                image_url: user.image_url,
                total: Number(user.totalTimeSpent)
              }))
            : []
        };
        dispatch(setTimewiseRanking(transformedTime));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// GET API For Fetching Referal Wise Ranking
export function fetchReferralWiseRanking(studentId: number) {
  return async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.referalwiseRank}/${studentId}/${10}`);
      if (response && response.data) {
        const rawData = response.data;

        const transformedReferral = {
          currentUser: rawData?.currentUserRank
            ? {
                total: rawData.currentUserRank[0].totalReferralId,
                rank: Number(rawData.currentUserRank[0].ranks)
              }
            : {},
          type: 'referral-wise',
          ranks: Array.isArray(rawData?.referralRanks)
            ? rawData.referralRanks.map((user: any) => ({
                name: user.name,
                image_url: user.image_url,
                total: Number(user.totalReferralId)
              }))
            : []
        };
        dispatch(setReferalwiseRanking(transformedReferral));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

// GET API For Fetching Referal Wise Ranking
export function fetchRegionalWiseRanking(studentId: number, streamId: number, type: string) {
  return async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${Apipoint.regionalRank}/${studentId}/${streamId}/10/${type}`);

      if (response && response.data) {
        const rawData = response.data;

        let currentUserTotal = '';
        let currentUserRank = '';

        // Handle both object and array for currentUser
        if (Array.isArray(rawData.currentUser)) {
          currentUserTotal = rawData.currentUser[0]?.total || '';
          currentUserRank = rawData.currentUser[0]?.rank || '';
        } else if (rawData.currentUser && typeof rawData.currentUser === 'object') {
          currentUserTotal = rawData.currentUser.total || '';
          currentUserRank = rawData.currentUser.rank || '';
        }

        const transformedRegional = {
          type: 'regional-wise',
          currentUser: {
            total: currentUserTotal,
            rank: Number(currentUserRank)
          },
          ranks: Array.isArray(rawData?.ranks)
            ? rawData.ranks.map((user: any) => ({
                name: user.name,
                image_url: user.image_url,
                total: Number(user.total)
              }))
            : []
        };

        dispatch(setRegionalRanking(transformedRegional));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
