import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { socketAction, socketUrl} from '../constants/constants';
import { useCheckUserValidityMutation } from '../rtk/features/api/auth.api';

const socket = io(socketUrl, { autoConnect: false, withCredentials: true });

export default () => {
  const [userCheck] = useCheckUserValidityMutation();
  const [socketData, setSocketData] = useState('');
  const [activeOrg, setActiveOrg] = useState(0);

  useEffect(() => {
    userCheck();
  }, []);

  useEffect(() => {
    socket.on(socketAction.TOTAL_CONNECTED_USER, (data) => {
      setSocketData(data);
    });
    socket.on('activeOrganization', (data) => {
      setActiveOrg(data);
    });
    return () => socket.off(socketAction.TOTAL_CONNECTED_USER);
  });

  return { socket, activeOrgs: activeOrg, totalScreen: socketData};
};
