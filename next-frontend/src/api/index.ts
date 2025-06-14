import api from './axios';
import * as adminApi from './admin';
import * as blogApi from './blog';

export default api;
export const logout = () => api.post('/auth/logout');

// Re-export from blog API
export const {
  getBlogPosts,
  getBlogPostBySlug,
  searchBlogPosts,
  getBlogPostsByTag,
  getTopTags,
  getTagBySlug,
  getAdminBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost
} = blogApi;

// Re-export from admin API
export const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  bulkDeletePosts,
  getAllTags, // Use admin's version
  getTagById,
  createTag, // Use admin's version
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
} = adminApi;

// Export alias for backward compatibility
export const getPostsByTag = getBlogPostsByTag;