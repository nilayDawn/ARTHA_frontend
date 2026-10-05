import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocuments, uploadDocument, deleteDocument } from '@/api/documents';

export const fetchDocumentsThunk = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDocuments();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch documents');
    }
  }
);

export const uploadDocumentThunk = createAsyncThunk(
  'documents/uploadDocument',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await uploadDocument(formData);
      dispatch(fetchDocumentsThunk());
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to upload document');
    }
  }
);

export const deleteDocumentThunk = createAsyncThunk(
  'documents/deleteDocument',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDocument(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete document');
    }
  }
);

const initialState = {
  documents: [],
  status: 'idle',
  uploadStatus: 'idle',
  error: null,
};

export const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearDocumentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocumentsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload;
      })
      .addCase(fetchDocumentsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadDocumentThunk.pending, (state) => {
        state.uploadStatus = 'loading';
      })
      .addCase(uploadDocumentThunk.fulfilled, (state) => {
        state.uploadStatus = 'succeeded';
      })
      .addCase(uploadDocumentThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
      });
  },
});

export const { clearDocumentError } = documentSlice.actions;

export const selectDocumentsList = (state) => state.documents.documents;
export const selectDocumentsLoading = (state) => state.documents.status === 'loading';
export const selectDocumentUploadLoading = (state) => state.documents.uploadStatus === 'loading';
export const selectDocumentsError = (state) => state.documents.error;

export default documentSlice.reducer;
