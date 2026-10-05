import API from './client';
import { ENDPOINTS } from './endpoints';

export const signUpUser = (payload) => API.post(ENDPOINTS.AUTH.SIGNUP, payload);
export const loginUser = (payload) => API.post(ENDPOINTS.AUTH.LOGIN, payload);
export const getUserProfile = () => API.get(ENDPOINTS.AUTH.ME);
export const logoutUser = () => API.post(ENDPOINTS.AUTH.LOGOUT);
