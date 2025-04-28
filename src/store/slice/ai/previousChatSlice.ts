import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatItem {
  id: string;
  title: string;
  userId: string;
  botType: string;
  subjectId?: string | null;
  chapterId?: string | null;
  threadId: string;
  createdAt?: string;
}

interface PreviousChatState {
  previousChatHistory: ChatItem[];
  error: string | null;
}

const initialState: PreviousChatState = {
  previousChatHistory: [],
  error: null
};

const previousChatSlice = createSlice({
  name: 'previousChat',
  initialState,
  reducers: {
    // ---------------- Set entire chat history ---------------
    setChatHistory: (state, action: PayloadAction<ChatItem[]>) => {
      const seen = new Set();
      const unique = action.payload.filter((item) => {
        if (seen.has(item.threadId)) return false;
        seen.add(item.threadId);
        return true;
      });

      state.previousChatHistory = unique;
    },

    // ---------------- Add new chat item to the top (no duplicates by threadId) ---------------
    addChatHistoryItem: (state, action: PayloadAction<ChatItem>) => {
      const exists = state.previousChatHistory.some(
        (item) => item.threadId === action.payload.threadId
      );

      if (!exists) {
        state.previousChatHistory.unshift(action.payload);
      }
    },

    // --------------- Update an existing item by ID --------------
    updateChatHistoryItem: (state, action: PayloadAction<ChatItem>) => {
      const index = state.previousChatHistory.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.previousChatHistory[index] = action.payload;
      }
    },
    // --------------- Delete by ID --------------
    deleteChatItem: (state, action: PayloadAction<string>) => {
      state.previousChatHistory = state.previousChatHistory.filter(
        (item) => item.id !== action.payload
      );
    },
    // ------------- Clear everything --------------
    clearChatHistory: (state) => {
      state.previousChatHistory = [];
    }
  }
});

export const {
  setChatHistory,
  addChatHistoryItem,
  updateChatHistoryItem,
  deleteChatItem,
  clearChatHistory
} = previousChatSlice.actions;

export default previousChatSlice.reducer;
