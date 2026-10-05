import axios from 'axios';
import { supabase } from '@/lib/supabase';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000/api/v1';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

export const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(async (config) => {
  // Inject Supabase JWT access token
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to retrieve Supabase session token:', error);
  }

  // Inject User-supplied Gemini / Artha API key
  const customApiKey =
    localStorage.getItem('user_artha_api_key') ||
    localStorage.getItem('user_gemini_api_key');

  if (customApiKey && customApiKey.trim()) {
    config.headers['X-User-LLM-Key'] = customApiKey.trim();
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('[Rate Limit Exceeded]', error.response?.data?.detail || 'Too many requests.');
    }
    return Promise.reject(error);
  }
);

export default API;
