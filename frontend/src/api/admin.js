import axios from "axios";
import { getApiUrl } from "../config/domains";
import i18n from "../i18n";

const API_URL = getApiUrl();

const API = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add authorization token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Handle API errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access (token expired, invalid, etc.)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login?redirect=/admin";
    }
    
    // Handle forbidden access (not admin)
    if (error.response?.status === 403) {
      window.location.href = "/";
    }
    
    return Promise.reject(error);
  }
);

// Blog Posts API endpoints
export const getAllPosts = (page = 0, size = 10, sortBy = "createdAt", direction = "desc") => 
  API.get(`/blog/posts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);

export const getPostById = (id) => API.get(`/blog/posts/${id}`);

export const createPost = (data) => API.post('/blog/posts', data);

export const updatePost = (id, data) => API.put(`/blog/posts/${id}`, data);

export const deletePost = (id) => API.delete(`/blog/posts/${id}`);

export const publishPost = (id) => API.put(`/blog/posts/${id}/publish`);

export const unpublishPost = (id) => API.put(`/blog/posts/${id}/unpublish`);

export const bulkDeletePosts = (ids) => API.post('/blog/posts/bulk-delete', { ids });

// Tags API endpoints
export const getAllTags = () => API.get('/blog/tags');

export const getTagById = (id) => API.get(`/blog/tags/${id}`);

export const createTag = (name) => API.post('/blog/tags', { name });

export const updateTag = (id, name) => API.put(`/blog/tags/${id}`, { name });

export const deleteTag = (id) => API.delete(`/blog/tags/${id}`);

// Media/File Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Dashboard statistics
export const getDashboardStats = () => API.get('/dashboard/stats');

export const getRecentPosts = (limit = 5) => API.get(`/dashboard/recent-posts?limit=${limit}`);

export const getRecentActivity = (limit = 10) => API.get(`/dashboard/recent-activity?limit=${limit}`);

// Settings API endpoints
export const getSettings = () => API.get('/settings');

export const updateSettings = (data) => API.put('/settings', data);

// Admin User Management
export const getAllUsers = (page = 0, size = 10) => 
  API.get(`/users?page=${page}&size=${size}`);

export const getUserById = (id) => API.get(`/users/${id}`);

export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });

export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;