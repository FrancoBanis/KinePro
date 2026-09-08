
import axios from 'axios';
import { BACKEND_URL, ROUTES } from '../constants/config';


const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('jwt_token');
      sessionStorage.removeItem('user');
      window.location.href = ROUTES.INICIAR_SESION;
    }
    return Promise.reject(error);
  }
);

export default api;