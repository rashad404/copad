import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  req.headers['X-Requested-With'] = 'XMLHttpRequest';
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
export const createAppointment = (data) => API.post("/appointments", data);
export const getAppointments = () => API.get("/appointments");
export const sendMessageToAI = (appointmentId, data) => API.post(`/conversations/${appointmentId}`, data);
export const getAppointmentChat = (appointmentId) => API.get(`/conversations/${appointmentId}`);

// Guest session endpoints
export const startGuestSession = () => API.post("/guest/start");
export const getGuestSession = (sessionId) => API.get(`/guest/session/${sessionId}`);
export const sendGuestMessage = (sessionId, message) => API.post(`/guest/chat/${sessionId}`, message);
export const saveGuestEmail = (sessionId, email) => API.post(`/guest/save-email/${sessionId}`, email);
export const saveConversation = (sessionId) => API.post(`/guest/save-conversation/${sessionId}`);
  
