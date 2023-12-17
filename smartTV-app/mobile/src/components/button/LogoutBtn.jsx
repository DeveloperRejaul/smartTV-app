import { Text } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearApp } from '../../utils/clearApp';
import { useAppContext } from '../../context/masjidContext';
import { handleLogout } from '../../rtk/features/auth/authSlice';

export default function LogoutBtn() {
  const { socket } = useAppContext();
  const dispatch = useDispatch();
  return (
    <Text onPress={async () => {
      try {
        await clearApp.clearAsyncAllData();
        await clearApp.deleteMemoryAllData();
        socket?.disconnect();
        dispatch(handleLogout());
      } catch (error) {
        console.log(error);
      }
    }}
    >
      Logout
    </Text>

  );
}
