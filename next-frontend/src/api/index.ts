import api from './axios';

export default api;
export const logout = () => api.post('/auth/logout');

// Re-export blog API functions
export * from './blog';

// Re-export admin API functions
export * from './admin';