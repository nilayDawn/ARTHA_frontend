import axios from 'axios';
import { supabase } from '../lib/supabase';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000/api/v1',
});

// Interceptor to attach JWT token to every outgoing request
API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints (Backend API alternative to direct SDK)
export const signUpUser = (payload) => API.post('/auth/signup', payload);
export const loginUser = (payload) => API.post('/auth/login', payload);
export const getUserProfile = () => API.get('/auth/me');
export const logoutUser = () => API.post('/auth/logout');

// Finance Endpoints
export const getTransactions = (params) => API.get('/transactions', { params });
export const getFinancialSummary = (params) => API.get('/summary', { params });
export const createTransaction = (payload) => API.post('/transactions', payload);
export const updateTransaction = (id, payload) => API.patch(`/transactions/${id}`, payload);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const getBudgets = (params) => API.get('/budgets', { params });
export const createBudget = (payload) => API.post('/budgets', payload);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

export const getGoals = () => API.get('/goals');
export const createGoal = (payload) => API.post('/goals', payload);
export const updateGoal = (id, payload) => API.patch(`/goals/${id}`, payload);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// AI Chat Endpoint
export const chatWithAgent = async (message, history = []) => {
  const res = await API.post('/chat', { message, history });
  return res.data;
};

// Document & Receipt Upload Endpoints
export const uploadDocument = async (formData) => {
  const res = await API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
export const getDocuments = () => API.get('/documents');
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

export const getTelegramLinkCode = () => API.post('/telegram/link-code');

// Email Report Endpoint
export const sendReportEmail = () => API.post('/reports/send-email');

export default API;