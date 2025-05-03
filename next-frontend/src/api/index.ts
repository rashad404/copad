import api from './axios';

export const logout = () => api.post('/auth/logout'); 