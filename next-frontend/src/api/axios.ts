import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8002/api';
  }

  // Client-side: check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8002/api';
  }

  // Production: use relative URL
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Set content type based on data
    if (config.data instanceof FormData) {
      // Let the browser set the content type for FormData (includes boundary)
      delete config.headers['Content-Type'];
    } else if (config.headers && !config.headers['Content-Type']) {
      // Set JSON content type for other requests if not already set
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Remove auto-redirect on 401. Let React handle it.
    return Promise.reject(error);
  }
);

export default api; 