import axios from 'axios';
const api = axios.create({
  baseURL: 'https://expensify-mdi3.onrender.com/api/v1',  
  withCredentials: true,  
});
api.interceptors.request.use(
  (config) => {
    return config;  
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { config, response } = error;
    const publicEndpoints = ['/signin', '/signup','/'];
    if (response?.status === 401 && !publicEndpoints.includes(config.url)) {
      window.dispatchEvent(new CustomEvent('auth-redirect', { detail: { path: '/' } }));
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default api;
