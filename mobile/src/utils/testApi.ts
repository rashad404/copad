import axios from 'axios';
import { API_BASE_URL, isLocalDevelopment } from '../config/environment';

export const testBackendConnection = async () => {
  // Use configured URL first
  const primaryUrl = `${API_BASE_URL}/api/guest/start`;
  
  // Fallback URLs for local development
  const fallbackUrls = isLocalDevelopment() ? [
    'http://localhost:8080/api/guest/start',
    'http://127.0.0.1:8080/api/guest/start',
    'http://192.168.1.105:8080/api/guest/start',
  ] : [];
  
  const urls = [primaryUrl, ...fallbackUrls];

  for (const url of urls) {
    try {
      console.log(`Testing connection to: ${url}`);
      const response = await axios.post(url, {}, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(`✅ Success with ${url}:`, response.status);
      return url;
    } catch (error: any) {
      console.log(`❌ Failed with ${url}:`, error.message);
    }
  }
  
  throw new Error('Could not connect to backend with any URL');
};