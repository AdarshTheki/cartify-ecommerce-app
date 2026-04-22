import axios, { type AxiosInstance } from 'axios';

// Request interceptor — attach auth token if present
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 50000,
});
