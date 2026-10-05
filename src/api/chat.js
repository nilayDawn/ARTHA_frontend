import API from './client';
import { ENDPOINTS } from './endpoints';

export const validateApiKey = (apiKey) => API.post(ENDPOINTS.CHAT.VALIDATE_KEY, { api_key: apiKey });

export const chatWithAgent = async (message, history = [], customApiKey = null) => {
  const keyToUse =
    customApiKey ||
    localStorage.getItem('user_artha_api_key') ||
    localStorage.getItem('user_gemini_api_key');

  const payload = { message, history };
  if (keyToUse && keyToUse.trim()) {
    payload.custom_api_key = keyToUse.trim();
  }

  const res = await API.post(ENDPOINTS.CHAT.BASE, payload);
  return res.data;
};
