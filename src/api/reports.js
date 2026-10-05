import API from './client';
import { ENDPOINTS } from './endpoints';

export const sendReportEmail = () => API.post(ENDPOINTS.REPORTS.EMAIL);
