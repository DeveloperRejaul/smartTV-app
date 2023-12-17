import { io } from 'socket.io-client';
import { SOCKET_URL } from '@env';

export function socketConnect(token) {
  const s = io(SOCKET_URL, { extraHeaders: { token: `Baraer ${token}` } });
  s.connect();
  return { socket: s };
}
