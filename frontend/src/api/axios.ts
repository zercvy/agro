import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
