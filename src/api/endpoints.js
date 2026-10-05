/**
 * Centralized API Endpoints Registry
 * Single source of truth for all backend API routes.
 */

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    DETAIL: (id) => `/transactions/${id}`,
  },
  BUDGETS: {
    BASE: '/budgets',
    DETAIL: (id) => `/budgets/${id}`,
    TEMPLATES: '/budgets/templates',
  },
  GOALS: {
    BASE: '/goals',
    DETAIL: (id) => `/goals/${id}`,
  },
  FINANCE: {
    SUMMARY: '/summary',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    DETAIL: (id) => `/documents/${id}`,
    REPROCESS: (id) => `/documents/${id}/reprocess`,
  },
  CHAT: {
    BASE: '/chat',
    VALIDATE_KEY: '/chat/validate-key',
    HISTORY: '/chat/history',
    CLEAR: '/chat/history/clear',
  },
  TELEGRAM: {
    LINK_CODE: '/telegram/link-code',
    STATUS: '/telegram/status',
    DISCONNECT: '/telegram/disconnect',
  },
  CATALOGUE: {
    CATEGORIES: '/catalogue/categories',
    MERCHANTS: '/catalogue/merchants',
    BUDGET_TEMPLATES: '/catalogue/budget-templates',
  },
  REPORTS: {
    EMAIL: '/reports/send-email',
  },
  PAYMENTS: {
    CHECKOUT: '/payments/checkout',
    SUBSCRIPTION: '/payments/subscription',
  },
};

export default ENDPOINTS;
