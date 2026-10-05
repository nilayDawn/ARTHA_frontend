import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatWithAgent } from '@/api/chat';

export const sendChatMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, customApiKey }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const history = state.chat.messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await chatWithAgent(message, history, customApiKey);
      return {
        reply: res.response || res.message || 'I have processed your request.',
        actionTaken: res.action_taken || null,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || err.message || 'Failed to get a response from Artha AI.'
      );
    }
  }
);

const initialState = {
  messages: [
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! I'm Artha, your personal financial intelligence agent. Ask me about your spending, set a budget, or upload an invoice!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  isOpen: false,
  status: 'idle',
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    setChatDrawerOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: `user-${Date.now()}`,
        sender: 'user',
        text: action.payload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    clearChatMessages: (state) => {
      state.messages = [initialState.messages[0]];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessageThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendChatMessageThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push({
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: action.payload.reply,
          actionTaken: action.payload.actionTaken,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(sendChatMessageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.messages.push({
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `⚠️ Error: ${action.payload}`,
          isError: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });
  },
});

export const {
  toggleChatDrawer,
  setChatDrawerOpen,
  addUserMessage,
  clearChatMessages,
} = chatSlice.actions;

export const selectChatMessages = (state) => state.chat.messages;
export const selectIsChatDrawerOpen = (state) => state.chat.isOpen;
export const selectChatLoading = (state) => state.chat.status === 'loading';
export const selectChatError = (state) => state.chat.error;

export default chatSlice.reducer;
