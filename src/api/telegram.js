import API from './client';
import { ENDPOINTS } from './endpoints';

export const getTelegramLinkCode = (refresh = false) =>
  API.post(ENDPOINTS.TELEGRAM.LINK_CODE, null, { params: { refresh } });
