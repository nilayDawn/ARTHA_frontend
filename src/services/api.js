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

// Finance Endpoints
export const getTransactions = () => API.get('/transactions');
export const createTransaction = (payload) => API.post('/transactions', payload);
export const getBudgets = () => API.get('/budgets');
export const createBudget = (payload) => API.post('/budgets', payload);
export const getGoals = () => API.get('/goals');
export const createGoal = (payload) => API.post('/goals', payload);

// AI Chat Endpoint
export const chatWithAgent = async (message, history = []) => {
  const res = await API.post('/chat', { message, history });
  return res.data;
};

// Document Upload Endpoint
export const uploadDocument = async (formData) => {
  const res = await API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};


export const getTelegramLinkCode = () => API.post('/telegram/link-code');

export default API;