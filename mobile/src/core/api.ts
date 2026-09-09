import axios from "axios";
import { Platform } from "react-native";
import { tokenStore } from "./storage";
export const API_URL =
  __DEV__ && Platform.OS === "web"
    ? "/dev-api"
    : (
        process.env.EXPO_PUBLIC_API_URL ||
        (__DEV__ ? "http://100.89.150.50:8002/api" : "https://azdoc.ai/api")
      ).replace(/\/$/, "");
export const SITE_URL = "https://azdoc.ai";
const api = axios.create({ baseURL: API_URL, timeout: 45000 });
api.interceptors.request.use(async (config) => {
  const token = await tokenStore.get();
  if (token && !config.headers.Authorization)
    config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    if (Platform.OS === "web") config.headers.delete("Content-Type");
    else config.headers.setContentType("multipart/form-data");
  }
  return config;
});
// Do not log health data, messages, credentials, or response bodies.
export default api;
