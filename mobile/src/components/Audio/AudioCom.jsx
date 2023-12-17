import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import { baseUrl } from '../../constants/constants';
import { useAppToast } from '../../hook/useToast';

let sound;
export default function AudioCom({ src, isPlay = true }) {
  const { isInternetReachable } = useNetInfo();
  const { showToast } = useAppToast();
  const mute = useSelector((state) => state.user.mute);

  async function handleAudio({ mute, src, isPlay, isInternetReachable }) {
    try {
      if (`${isInternetReachable}` === 'false') return showToast({ message: 'You are offline' });
      const { sound: s } = await Audio.Sound.createAsync({ uri: `${baseUrl + src}` });
      sound = s;
      if (sound && !mute) {
        await sound?.playAsync();
        await sound?.setVolumeAsync(1, 0);
        await sound?.setIsLoopingAsync(true);
      }
      if (!isPlay) {
        await sound?.stopAsync();
        await sound?.unloadAsync();
      }
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    try {
      if (src)handleAudio({ mute, src, isPlay, isInternetReachable });
    } catch (error) {
      // console.log(error);
    }

    return async () => {
      if (sound) {
        await sound?.stopAsync();
        await sound?.unloadAsync();
      }
    };
  }, [mute, src, isPlay, isInternetReachable]);

  return <View />;
}
