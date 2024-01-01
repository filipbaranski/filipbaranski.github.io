import axios from 'axios';
import router from '../router';

const api = import.meta.env.VITE_SERVER_URL;

export const client = axios.create({
	baseURL: api,
    headers: {
      'Content-Type': 'application/json'
    }
});

client.interceptors.request.use(config => {
  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  config.headers['bearer'] = userToken || "";
  config.headers['id'] = userId || "";

  return config;
});

client.interceptors.response.use(response => {
  return response;
}, (error) => {
  const responseStatus = error.response.status;
  if (responseStatus === 401) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('dates');
    localStorage.removeItem('calendar');
    router.push('/login');
  }
  return Promise.reject(error);
});
