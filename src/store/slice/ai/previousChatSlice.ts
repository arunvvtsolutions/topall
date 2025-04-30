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
    // ---------------- Set entire chat history ---------------
    setChatHistory(state, action: PayloadAction<ChatItem[]>) {
      const map = new Map<string, ChatItem>();
      action.payload.forEach(item => {
        // require both threadId and non-placeholder title
        if (item.threadId && item.title && item.title !== 'Untitled Chat') {
          if (!map.has(item.threadId)) {
            map.set(item.threadId, item);
          }
        }
      });
      state.previousChatHistory = Array.from(map.values());
    },

    // ---------------- Add a single new chat entry if valid and unique ---------------
    addChatHistoryItem(state, action: PayloadAction<ChatItem>) {
      const incoming = action.payload;
      if (incoming.threadId && incoming.title && incoming.title !== 'Untitled Chat') {
        // check existing by threadId
        const exists = state.previousChatHistory.some(item => item.threadId === incoming.threadId);
        if (!exists) {
          state.previousChatHistory.unshift(incoming);
        }
      }
    },

    // ---------------- Update an existing chat entry ---------------
    updateChatHistoryItem(state, action: PayloadAction<ChatItem>) {
      const incoming = action.payload;
      if (incoming.threadId && incoming.title && incoming.title !== 'Untitled Chat') {
        const idx = state.previousChatHistory.findIndex(item => item.id === incoming.id);
        if (idx !== -1) {
          state.previousChatHistory[idx] = incoming;
        }
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
