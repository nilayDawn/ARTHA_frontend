import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import financeReducer from './slices/financeSlice';
import documentReducer from './slices/documentSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    finance: financeReducer,
    documents: documentReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable objects like Date or Supabase session metadata safely
    }),
});

export default store;
