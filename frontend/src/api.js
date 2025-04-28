import axios from "axios";
import { getApiUrl } from "./config/domains";
import i18n from "./i18n";

const API_URL = getApiUrl();

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");


export const createAppointment = (data) => API.post("/appointments", data);
export const getAppointments = () => API.get("/appointments");
export const sendMessageToAI = (appointmentId, data) => API.post(`/messages/${appointmentId}`, data);
export const getAppointmentChat = (appointmentId) => API.get(`/messages/${appointmentId}`);

// Guest session endpoints
export const startGuestSession = () => API.post("/guest/start");
export const getGuestSession = (sessionId) => API.get(`/guest/session/${sessionId}`);
export const sendGuestMessage = async (sessionId, message, chatId) => {
  const response = await API.post(
    `/guest/chat/${sessionId}/${chatId}`,
    { 
      message,
      language: i18n.language
    }
  );
  return response.data;
};
export const saveGuestEmail = (sessionId, email) => API.post(`/guest/save-email/${sessionId}`, email);

// Guest chat management
// Specifically return the response rather than performing a void call
export const createGuestChat = (sessionId, title) => {
  return API.post(`/guest/chats/${sessionId}`, { title });
};
export const updateGuestChat = (sessionId, chatId, title) => {
  return API.put(`/guest/chats/${sessionId}/${chatId}`, { title });
};
export const deleteGuestChat = (sessionId, chatId) => {
  return API.delete(`/guest/chats/${sessionId}/${chatId}`);
};

// Get chat history
export const getChatHistory = (sessionId, chatId) => API.get(`/guest/chat/${sessionId}/${chatId}/history`);

// Blog endpoints
export const getBlogPosts = (page = 0, size = 9, sortBy = "publishedAt", direction = "desc", language = i18n.language, ignoreLanguage = false) => {
  let url = `/blog?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
  if (!ignoreLanguage) {
    url += `&language=${language}`;
  }
  return API.get(url);
};

export const getTopTags = (limit = 10) => API.get(`/tags/top?limit=${limit}`);

// Blog post management
export const deleteBlogPost = (postId) => API.delete(`/blog/${postId}`);
export const getBlogPostBySlug = (slug) => API.get(`/blog/${slug}`);

// Blog search functionality
export const searchBlogPosts = (keyword, page = 0, size = 9, language = i18n.language) => 
  API.get(`/blog/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&language=${language}`);

// Blog posts by tag
export const getBlogPostsByTag = (tagSlug, page = 0, size = 9, language = i18n.language) => 
  API.get(`/blog/tag/${tagSlug}?page=${page}&size=${size}&language=${language}`);

export const getTagBySlug = (slug) => API.get(`/tags/${slug}`);

export const createBlogPost = (data) => {
  if (!data.language) data.language = i18n.language;
  return API.post('/blog', data);
};

export const createTag = (name) => API.post('/tags', null, { params: { name } });

export const getAllTags = () => API.get('/tags');

export const updateBlogPost = (id, data) => {
  if (!data.language) data.language = i18n.language;
  return API.put(`/blog/${id}`, data);
};

// Get blog post by ID (for admin panel)
export const getBlogPostById = (id) => API.get(`/admin/blog/posts/${id}`);


// Use this endpoint for admin actions
export const getAdminBlogPostById = (id) => API.get(`/admin/blog/posts/${id}`);
