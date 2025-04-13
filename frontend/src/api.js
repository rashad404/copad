import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const createAppointment = (data) => API.post("/appointments", data);
export const getAppointments = () => API.get("/appointments");
export const sendMessageToAI = (appointmentId, data) => API.post(`/conversations/${appointmentId}`, data);
export const getAppointmentChat = (appointmentId) => API.get(`/conversations/${appointmentId}`);
  
