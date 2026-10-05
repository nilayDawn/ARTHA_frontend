import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isApiKeyModalOpen: false,
  isTelegramModalOpen: false,
  isDocumentUploadModalOpen: false,
  isProfileModalOpen: false,
  toast: null, // { message: string, type: 'success' | 'error' | 'info' }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setApiKeyModalOpen: (state, action) => {
      state.isApiKeyModalOpen = action.payload;
    },
    setTelegramModalOpen: (state, action) => {
      state.isTelegramModalOpen = action.payload;
    },
    setDocumentUploadModalOpen: (state, action) => {
      state.isDocumentUploadModalOpen = action.payload;
    },
    setProfileModalOpen: (state, action) => {
      state.isProfileModalOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setApiKeyModalOpen,
  setTelegramModalOpen,
  setDocumentUploadModalOpen,
  setProfileModalOpen,
  showToast,
  clearToast,
} = uiSlice.actions;

export const selectIsApiKeyModalOpen = (state) => state.ui.isApiKeyModalOpen;
export const selectIsTelegramModalOpen = (state) => state.ui.isTelegramModalOpen;
export const selectIsDocumentUploadModalOpen = (state) => state.ui.isDocumentUploadModalOpen;
export const selectIsProfileModalOpen = (state) => state.ui.isProfileModalOpen;
export const selectCurrentToast = (state) => state.ui.toast;

export default uiSlice.reducer;
