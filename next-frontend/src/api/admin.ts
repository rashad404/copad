import api from './axios';
import { AxiosResponse } from 'axios';
import { BlogPost, BlogPostListItem, BlogPostsResponse, Tag, CreateUpdateBlogPost } from './blog';

// Create a dedicated admin API instance
const adminAPI = api;

// Type definitions for admin API
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTags: number;
  totalUsers: number;
  totalViews: number;
}

export interface UserListItem {
  id: number;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
  active: boolean;
}

export interface UserListResponse {
  content: UserListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
}

// Blog Posts API endpoints
export const getAllPosts = (
  page = 0, 
  size = 10, 
  sortBy = "createdAt", 
  direction = "desc"
): Promise<AxiosResponse<BlogPostsResponse>> => {
  return adminAPI.get(
    `/admin/blog/posts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
  );
};

export const getPostById = (id: number): Promise<AxiosResponse<BlogPost>> => {
  return adminAPI.get(`/admin/blog/posts/${id}`);
};

export const createPost = (data: CreateUpdateBlogPost): Promise<AxiosResponse<BlogPost>> => {
  return adminAPI.post('/admin/blog/posts', data);
};

export const updatePost = (id: number, data: CreateUpdateBlogPost): Promise<AxiosResponse<BlogPost>> => {
  return adminAPI.put(`/admin/blog/posts/${id}`, data);
};

export const deletePost = (id: number): Promise<AxiosResponse<void>> => {
  return adminAPI.delete(`/admin/blog/posts/${id}`);
};

export const publishPost = (id: number): Promise<AxiosResponse<BlogPost>> => {
  return adminAPI.put(`/admin/blog/posts/${id}/publish`);
};

export const unpublishPost = (id: number): Promise<AxiosResponse<BlogPost>> => {
  return adminAPI.put(`/admin/blog/posts/${id}/unpublish`);
};

export const bulkDeletePosts = (ids: number[]): Promise<AxiosResponse<void>> => {
  return adminAPI.post('/admin/blog/posts/bulk-delete', { ids });
};

// Tags API endpoints
export const getAllTags = (): Promise<AxiosResponse<Tag[]>> => {
  return adminAPI.get('/admin/blog/tags');
};

export const getTagById = (id: number): Promise<AxiosResponse<Tag>> => {
  return adminAPI.get(`/admin/blog/tags/${id}`);
};

export const createTag = (name: string): Promise<AxiosResponse<Tag>> => {
  return adminAPI.post('/admin/blog/tags', { name });
};

export const updateTag = (id: number, name: string): Promise<AxiosResponse<Tag>> => {
  return adminAPI.put(`/admin/blog/tags/${id}`, { name });
};

export const deleteTag = (id: number): Promise<AxiosResponse<void>> => {
  return adminAPI.delete(`/admin/blog/tags/${id}`);
};

// Media/File Upload
export const uploadImage = (file: File): Promise<AxiosResponse<{ original: string, thumb: string }>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return adminAPI.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Dashboard statistics
export const getDashboardStats = (): Promise<AxiosResponse<DashboardStats>> => {
  return adminAPI.get('/admin/dashboard/stats');
};

export const getRecentPosts = (limit = 5): Promise<AxiosResponse<BlogPostListItem[]>> => {
  return adminAPI.get(`/admin/dashboard/recent-posts?limit=${limit}`);
};

// User Management
export const getAllUsers = (
  page = 0, 
  size = 10
): Promise<AxiosResponse<UserListResponse>> => {
  return adminAPI.get(`/admin/users?page=${page}&size=${size}`);
};

export const getUserById = (id: number): Promise<AxiosResponse<UserListItem>> => {
  return adminAPI.get(`/admin/users/${id}`);
};

export const updateUserRole = (id: number, role: string): Promise<AxiosResponse<UserListItem>> => {
  return adminAPI.put(`/admin/users/${id}/role`, { role });
};

export const deleteUser = (id: number): Promise<AxiosResponse<void>> => {
  return adminAPI.delete(`/admin/users/${id}`);
};

export const activateUser = (id: number): Promise<AxiosResponse<UserListItem>> => {
  return adminAPI.put(`/admin/users/${id}/activate`);
};

export const deactivateUser = (id: number): Promise<AxiosResponse<UserListItem>> => {
  return adminAPI.put(`/admin/users/${id}/deactivate`);
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  bulkDeletePosts,
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  uploadImage,
  getDashboardStats,
  getRecentPosts,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  activateUser,
  deactivateUser
};