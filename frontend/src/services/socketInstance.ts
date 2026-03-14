import { io, type Socket } from 'socket.io-client';

export const socketInstance: Socket = io(import.meta.env.VITE_API_URL, {
  timeout: 10000,
  auth: { token: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') },
  // withCredentials: true,
});
