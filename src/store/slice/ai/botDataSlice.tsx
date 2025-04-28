import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BotData {
  id: number;
  botName: string | null;
  botType: number | null;
  shortUrl: string | null;
  subjectName?: string | null;
  subjectId?: number | null;
  chapterId?: number | null;
  topicId?: number | null;
  classId?: number | null;
  userId?: number | null;
}

interface BotDataState {
  bot: BotData | null;
  error: string | null;
}

const initialState: BotDataState = {
  bot: null,
  error: null
};

const botDataSlice = createSlice({
  name: 'botData',
  initialState,
  reducers: {
    setBotData: (state, action: PayloadAction<BotData>) => {
      state.bot = action.payload;
    },
    clearBotData: (state) => {
      state.bot = null;
    }
  }
});

export const { setBotData, clearBotData } = botDataSlice.actions;

export default botDataSlice.reducer;
