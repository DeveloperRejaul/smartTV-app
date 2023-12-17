import { Stack, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Image } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useNetInfo } from '@react-native-community/netinfo';
import { baseUrl, contentType, prayerNavigation } from '../../constants/constants';
import { updatePrayerNavigation } from '../../rtk/features/navigation/navigationSlice';
import { checkEqual } from '../../utils/selectorCheck';
import AudioCom from '../../components/Audio/AudioCom';
import { RH, RW } from '../../constants/dimensions';
import { findUrlType } from '../../utils/utils.fn';
import ClockCom2 from '../../components/clock/ClockCom2';
import NetError from '../../components/NetError/NetError';

let timeout;

export default function Khutbha() {
  const { isInternetReachable } = useNetInfo();
  const [play, setPlay] = useState(true);
  const { mute } = useSelector((state) => state.user, checkEqual) || {};
  const { contents } = useSelector((state) => state.content, checkEqual);
  const khutbahTime = contents?.filter((d) => d.type === contentType.KHUTBAH)[0];
  const stayKhutbah = khutbahTime?.startTime;
  const dispatch = useDispatch();
  const audio = khutbahTime?.audio;
  const isShow = useSelector((state) => state.screen?.screen?.khutbahProgress);

  const url = findUrlType(khutbahTime?.src);

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updatePrayerNavigation(prayerNavigation.SALAT));
    }, stayKhutbah);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!isShow) return <View flex={1} bg='black' />;
  if (`${isInternetReachable}` === 'false') return <NetError />;

  switch (url.type) {
  case 'image':
    return (
      <>
        {audio && <AudioCom src={audio} />}
        <Stack flex='1' justifyContent='center' alignItems='center' bg='#ffffff'>
          <Image style={{ width: RW(100), height: RH(100) }} source={{ uri: baseUrl + khutbahTime?.src }} />
          <ClockCom2 />
        </Stack>
      </>
    );
  case 'video':
    const isLink = url.src.includes('http');
    return (
      <>
        {audio && <AudioCom src={audio} />}
        <Stack height={RH(100)} width={RW(100)} justifyContent='center' alignItems='center'>
          <Video
            source={{ uri: isLink ? url.src : baseUrl + url.src }}
            shouldPlay={play}
            style={{ height: RH(100), width: RW(100) }}
            resizeMode={ResizeMode.CONTAIN}
            isMuted={audio ? true : mute}
          />
          <ClockCom2 />
        </Stack>
      </>
    );

  case 'youtube':
    return (
      <>
        {audio && <AudioCom src={audio} />}
        <Stack height={RH(100)} width={RW(100)} justifyContent='center' alignItems='center'>
          <YoutubePlayer
            height={RH(100)}
            width={RW(100)}
            play={play}
            videoId={url.src}
            forceAndroidAutoplay={play}
            initialPlayerParams={{ loop: false, controls: false }}
            mute={audio ? true : mute}
            volume={100}
          />
          <ClockCom2 />
        </Stack>
      </>
    );

  default:
    break;
  }
}
