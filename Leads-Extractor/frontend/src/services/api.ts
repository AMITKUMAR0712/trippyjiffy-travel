import axios from 'axios';
import type {
  Company,
  SearchFormData,
  SearchProgress,
  SearchHistory,
  User,
  Pagination,
  Analytics,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/leads-api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leads_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ success: boolean; data: { user: User; token: string } }>(
      '/auth/register',
      data
    ),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: { user: User; token: string } }>(
      '/auth/login',
      data
    ),
  me: () => api.get<{ success: boolean; data: User }>('/auth/me'),
};

export const searchApi = {
  search: (data: SearchFormData) =>
    api.post<{
      success: boolean;
      data: {
        searchId: string;
        status: string;
      };
    }>('/search', data),

  getStatus: (searchId: string) =>
    api.get<{ success: boolean; data: SearchProgress }>(
      `/search/${searchId}/status`
    ),

  getCompanies: (params?: Record<string, string | number>) =>
    api.get<{
      success: boolean;
      data: { companies: Company[]; pagination: Pagination };
    }>('/companies', { params }),

  deleteCompany: (id: string) => api.delete(`/company/${id}`),

  deleteCompanies: (ids: string[]) =>
    api.delete('/companies', { data: { ids } }),

  getHistory: (params?: Record<string, number>) =>
    api.get<{
      success: boolean;
      data: { history: SearchHistory[]; pagination: Pagination };
    }>('/history', { params }),

  getAnalytics: () =>
    api.get<{ success: boolean; data: Analytics }>('/analytics'),

  getConfig: () =>
    api.get<{ success: boolean; data: import('../types').AppConfig }>('/config'),

  exportCsv: (params?: Record<string, string>) =>
    api.get('/export/csv', { params, responseType: 'blob' }),

  exportExcel: (params?: Record<string, string>) =>
    api.get('/export/excel', { params, responseType: 'blob' }),

  exportPdf: (params?: Record<string, string>) =>
    api.get('/export/pdf', { params, responseType: 'blob' }),
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export default api;
