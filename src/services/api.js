import axios from 'axios';
import { supabase } from '../lib/supabase';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000/api/v1';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor to attach JWT token and custom LLM API key to every outgoing request
API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const customApiKey = localStorage.getItem('user_artha_api_key') || localStorage.getItem('user_gemini_api_key');
  if (customApiKey && customApiKey.trim()) {
    config.headers['X-User-LLM-Key'] = customApiKey.trim();
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

// AI Chat Endpoint & Key Validation
export const validateApiKey = (apiKey) => API.post('/chat/validate-key', { api_key: apiKey });

export const chatWithAgent = async (message, history = [], customApiKey = null) => {
  const keyToUse = customApiKey || localStorage.getItem('user_artha_api_key') || localStorage.getItem('user_gemini_api_key');
  const payload = { message, history };
  if (keyToUse && keyToUse.trim()) {
    payload.custom_api_key = keyToUse.trim();
  }
  const res = await API.post('/chat', payload);
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

export const getTelegramLinkCode = (refresh = false) => API.post('/telegram/link-code', null, { params: { refresh } });

// Email Report Endpoint
export const sendReportEmail = () => API.post('/reports/send-email');

export default API;