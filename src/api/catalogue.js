import API from './client';
import { ENDPOINTS } from './endpoints';

export const getCategories = async () => {
  const res = await API.get(ENDPOINTS.CATALOGUE.CATEGORIES);
  return res.data;
};

export const getMerchantRules = async () => {
  const res = await API.get(ENDPOINTS.CATALOGUE.MERCHANTS);
  return res.data;
};

export const getBudgetTemplates = async () => {
  const res = await API.get(ENDPOINTS.CATALOGUE.BUDGET_TEMPLATES);
  return res.data;
};
