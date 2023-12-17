import { socketAction } from '../../utils/socketAction';
import { getUser, removeUser } from '../file/userConnectList';
import { getUserCount } from './user.entity';


export const handleDisconnect = async (socket, id) => {
  const result = removeUser(id);
  console.log(result);
  const users = getUser();
  console.log(users);
  const userCount = await getUserCount(users);
  socket.to('superAdmin').emit('activeOrganization', Object.keys(userCount).length);
  Object.keys(userCount).forEach((key) => {
    socket.to(key).emit(socketAction.TOTAL_CONNECTED_USER, userCount[key]);

  });
  // socket.emit(socketAction.TOTAL_CONNECTED_USER, users);
};


export const handleConnect = async (socket) => {
  const users = getUser();
  console.log(users);
  const userCount = await getUserCount(users);
  socket.to('superAdmin').emit('activeOrganization', Object.keys(userCount).length);
  Object.keys(userCount).forEach((key) => {
    socket.to(key).emit(socketAction.TOTAL_CONNECTED_USER, userCount[key]);

  });
  // socket.emit(socketAction.TOTAL_CONNECTED_USER, users);
};