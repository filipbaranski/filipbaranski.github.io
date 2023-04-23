import axios from 'axios';

const api = 'https://rich-plum-barnacle-wrap.cyclic.app';

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
