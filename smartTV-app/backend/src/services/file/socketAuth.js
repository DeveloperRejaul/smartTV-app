import decodeAuthToken from '../../utils/decodeAuthToken';
import { addUser } from './userConnectList';

export const authSocket = async (socket, next) => {

  try {
    const cookie = socket?.handshake?.headers?.cookie?.split('=')[1];
    const token = socket.handshake?.headers?.token?.split(' ')[1];

    // For Android 
    if (token) {
      const user = await decodeAuthToken(token);
      if (!user) next(Error('Unauthorized'));
      socket.join(user?.id);
      addUser({ id: user?.id, type: user?.userType, socketId: socket?.id });
      next();
    }


    // for web 
    if (cookie) {
      const user = await decodeAuthToken(cookie);
      if (!user) return next(Error('Unauthorized'));
      socket.join(user?.id);
      if (user?.userType === 'supper-admin') socket.join('superAdmin');
      else {
        socket.join(user?.org?.toString());
      }

      addUser({ id: user?.id, type: user?.userType, socketId: socket?.id, org: user?.org?.toString() || null });
      next();
    }
  } catch (error) {
    console.log(error);
  }

};
