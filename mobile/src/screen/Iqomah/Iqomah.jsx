import { Stack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResizeMode, Video } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { baseUrl, contentType, prayerNavigation } from '../../constants/constants';
import { findUrlType } from '../../utils/utils.fn';
import { RH, RW } from '../../constants/dimensions';
import { checkEqual } from '../../utils/selectorCheck';
import { updatePrayerNavigation } from '../../rtk/features/navigation/navigationSlice';

let timeout;

export default function Iqomah() {
  const day = new Date().getUTCDay();
  const [play, setPlay] = useState(true);
  const { mute } = useSelector((state) => state.user, checkEqual) || {};
  const { activePrayerTime } = useSelector((state) => state.content, checkEqual);
  const { activeContent } = useSelector((state) => state.content, checkEqual) || {};
  const iqomahTime = activeContent?.filter((d) => d.type === contentType.IQOMAH)[0];
  const stayIqomah = iqomahTime?.startTime;
  const url = findUrlType(iqomahTime?.src);
  const dispatch = useDispatch();

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updatePrayerNavigation(day === 5 && activePrayerTime?.name === 'dhuhr' ? prayerNavigation.KHOTBAH : prayerNavigation.SALAT_PREPARE));
    }, stayIqomah);
    return () => {
      clearTimeout(timeout);
      setPlay(false);
    };
  }, []);

  if (url?.type === 'video') {
    return (
      <Stack height={RH(100)} width={RW(100)} justifyContent='center' alignItems='center'>
        <Video
          isLooping
          source={{ uri: baseUrl + url.src }}
          shouldPlay={play}
          style={{ height: RH(100), width: RW(100) }}
          resizeMode={ResizeMode.CONTAIN}
          isMuted={mute}
        />
      </Stack>
    );
  } if (url?.type === 'youtube') {
    return (
      <Stack height={RH(100)} width={RW(100)} justifyContent='center' alignItems='center'>
        <YoutubePlayer
          initialPlayerParams={{ loop: true, controls: false }}
          height={RH(100)}
          width={RW(100)}
          play={play}
          videoId={url.src}
          forceAndroidAutoplay={play}
          mute={mute}
          volume={100}
        />
      </Stack>
    );
  }
  return (
    <Stack flex='1' justifyContent='center' alignItems='center' bg='white'>
      <Text fontWeight='bold' fontSize='4xl' color='black' textTransform='capitalize'>Iqomah Time Active </Text>
    </Stack>
  );
}
