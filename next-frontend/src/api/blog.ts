import api from './axios';
import { AxiosResponse } from 'axios';

// Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: {
    id: number;
    username: string;
    name: string;
  };
  tags: Tag[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  featuredImage: string | null;
  readingTimeMinutes: number;
  language: string;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  author: {
    id: number;
    username: string;
    name: string;
  };
  tags: Tag[];
  published: boolean;
  publishedAt: string | null;
  featuredImage: string | null;
  readingTimeMinutes: number;
  language: string;
}

export interface BlogPostsResponse {
  content: BlogPostListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

export interface CreateUpdateBlogPost {
  title: string;
  summary: string;
  content: string;
  tags: number[] | string[];
  published?: boolean;
  featuredImage?: string | null;
  language?: string;
}

// Public blog endpoints
export const getBlogPosts = (
  page = 0,
  size = 9,
  sortBy = "publishedAt",
  direction = "desc",
  language?: string,
  ignoreLanguage = false
): Promise<AxiosResponse<BlogPostsResponse>> => {
  let url = `/blog?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
  
  if (!ignoreLanguage && language) {
    url += `&language=${language}`;
  }
  
  return api.get(url);
};

export const getBlogPostBySlug = (
  slug: string
): Promise<AxiosResponse<BlogPost>> => {
  return api.get(`/blog/${slug}`);
};

export const searchBlogPosts = (
  keyword: string,
  page = 0,
  size = 9,
  language?: string
): Promise<AxiosResponse<BlogPostsResponse>> => {
  return api.get(
    `/blog/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}${language ? `&language=${language}` : ''}`
  );
};

export const getBlogPostsByTag = (
  tagSlug: string,
  page = 0,
  size = 9,
  language?: string
): Promise<AxiosResponse<BlogPostsResponse>> => {
  return api.get(
    `/blog/tag/${tagSlug}?page=${page}&size=${size}${language ? `&language=${language}` : ''}`
  );
};

// Tag endpoints
export const getTopTags = (
  limit = 10
): Promise<AxiosResponse<Tag[]>> => {
  return api.get(`/tags/top?limit=${limit}`);
};

export const getTagBySlug = (
  slug: string
): Promise<AxiosResponse<Tag>> => {
  return api.get(`/tags/${slug}`);
};

export const getAllTags = (): Promise<AxiosResponse<Tag[]>> => {
  return api.get('/tags');
};

export const createTag = (
  name: string
): Promise<AxiosResponse<Tag>> => {
  return api.post('/tags', null, { params: { name } });
};

// Admin blog endpoints
export const getAdminBlogPosts = (
  page = 0,
  size = 9,
  sortBy = "createdAt",
  direction = "desc"
): Promise<AxiosResponse<BlogPostsResponse>> => {
  return api.get(
    `/admin/blog/posts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
  );
};

export const getBlogPostById = (
  id: number
): Promise<AxiosResponse<BlogPost>> => {
  return api.get(`/admin/blog/posts/${id}`);
};

export const createBlogPost = (
  data: CreateUpdateBlogPost
): Promise<AxiosResponse<BlogPost>> => {
  return api.post('/admin/blog/posts', data);
};

export const updateBlogPost = (
  id: number,
  data: CreateUpdateBlogPost
): Promise<AxiosResponse<BlogPost>> => {
  return api.put(`/admin/blog/posts/${id}`, data);
};

export const deleteBlogPost = (
  id: number
): Promise<AxiosResponse<void>> => {
  return api.delete(`/admin/blog/posts/${id}`);
};

export const publishBlogPost = (
  id: number
): Promise<AxiosResponse<BlogPost>> => {
  return api.put(`/admin/blog/posts/${id}/publish`);
};

export const unpublishBlogPost = (
  id: number
): Promise<AxiosResponse<BlogPost>> => {
  return api.put(`/admin/blog/posts/${id}/unpublish`);
};