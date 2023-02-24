import axios from 'axios';

const api = 'https://rich-plum-barnacle-wrap.cyclic.app';

export const client = axios.create({
	baseURL: api,
    headers: {
      'bearer': localStorage.getItem('userToken') || "",
      'Content-Type': 'application/json'
    }
});
