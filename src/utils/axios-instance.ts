import axios from 'axios';
import router from '../router';
import { clearStorage, getStoredUser } from './helpers';

const api = import.meta.env.VITE_SERVER_URL;

export const client = axios.create({
	baseURL: api,
    headers: {
      'Content-Type': 'application/json'
    }
});

client.interceptors.request.use(config => {
  const { token, id } = getStoredUser();
  config.headers['bearer'] = token || "";
  config.headers['id'] = id || "";

  return config;
});

client.interceptors.response.use(response => {
  return response;
}, (error) => {
  const responseStatus = error.response.status;
  if (responseStatus === 401) {
    clearStorage();
    router.push('/login');
  }
  return Promise.reject(error);
});
