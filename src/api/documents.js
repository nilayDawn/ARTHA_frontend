import API from './client';
import { ENDPOINTS } from './endpoints';

export const uploadDocument = async (formData) => {
  const res = await API.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getDocuments = () => API.get(ENDPOINTS.DOCUMENTS.BASE);
export const deleteDocument = (id) => API.delete(ENDPOINTS.DOCUMENTS.DETAIL(id));
