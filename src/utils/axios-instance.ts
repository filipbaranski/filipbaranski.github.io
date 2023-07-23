import axios from 'axios';

const api = import.meta.env.VITE_SERVER_URL;

export const client = axios.create({
	baseURL: api,
    headers: {
      'Content-Type': 'application/json'
    }
});

client.interceptors.request.use(config=> {
  const userToken = localStorage.getItem('userToken');
  config.headers['bearer'] = userToken || "";

  return config;
});
