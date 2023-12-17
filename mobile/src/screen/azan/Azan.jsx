import { Stack } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResizeMode, Video } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Image, Text, View, StyleSheet } from 'react-native';
import { BASE_URL } from '@env';
import { useNetInfo } from '@react-native-community/netinfo';
import { baseUrl, contentType, navigationType, prayerNavigation } from '../../constants/constants';
import { RF, RH, RW } from '../../constants/dimensions';
import { findUrlType } from '../../utils/utils.fn';
import { checkEqual } from '../../utils/selectorCheck';
import { handleAzanIqomahGap, updateNavigation, updatePrayerNavigation } from '../../rtk/features/navigation/navigationSlice';
import ClockCom2 from '../../components/clock/ClockCom2';
import AudioCom from '../../components/Audio/AudioCom';
import NetError from '../../components/NetError/NetError';

let timeout;
const day = new Date().getDay();
function Azan() {
  const { isInternetReachable } = useNetInfo();
  const [play, setPlay] = useState(true);

  const { activeContent, activePrayerTime } = useSelector((state) => state.content, checkEqual) || {};

  const { mute } = useSelector((state) => state.user, checkEqual) || {};
  const azanTime = activeContent?.filter((d) => d.type === contentType.AZAN)[0];
  const stayAzan = azanTime?.startTime;
  const gap = azanTime?.endTime - azanTime?.startTime;
  const location = useSelector((state) => state.user.location);

  const url = findUrlType(azanTime?.src);
  const isServerUrl = url?.src?.includes('upload/');
  const dispatch = useDispatch();
  // console.log(azanTime);
  // console.log(url);
  // console.log(isServerUrl);

  useEffect(() => {
    // console.log('stayAzan');
    timeout = setTimeout(() => {
      setPlay(false);
      if (day === 3 && activePrayerTime[0].name === 'dhuhr') {
        dispatch(updatePrayerNavigation(prayerNavigation.KHOTBAH));
        dispatch(updateNavigation(navigationType.PRAYER));
        dispatch(handleAzanIqomahGap(null));
      } else {
        dispatch(handleAzanIqomahGap(gap));
        dispatch(updateNavigation(navigationType.HOME));
      }
    }, stayAzan);
    return () => {
      clearTimeout(timeout);
      setPlay(false);
    };
  }, []);

  const audio = azanTime?.audio;

  if (`${isInternetReachable}` === 'false') return <NetError />;
  switch (url?.type) {
  case 'video':
    return (
      <>
        {audio && <AudioCom src={audio} isPlay={play} />}
        <View style={styles.description}>
          <Text style={{
            textTransform: 'uppercase',
            color: '#ff1f1f',
            fontSize: RF(4),
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 3, height: 7 },
            textShadowRadius: 10,
            backgroundColor: '#0000007a',
            padding: 10,
            borderRadius: 7,
          }}
          >
            {`${activePrayerTime[0]?.name} in ${location} `}

          </Text>
        </View>
        <Stack height={RH(100)} width={RW(100)} justifyContent='center' alignItems='center'>
          <Video
            source={{ uri: isServerUrl ? baseUrl + url.src : url.src }}
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
        {audio && <AudioCom src={audio} isPlay={play} />}
        <View style={styles.description}>
          <Text style={{
            textTransform: 'uppercase',
            color: '#ff1f1f',
            fontSize: RF(4),
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 3, height: 7 },
            textShadowRadius: 10,
            backgroundColor: '#0000007a',
            padding: 10,
            borderRadius: 7,
          }}
          >
            {`${activePrayerTime[0]?.name} in ${location} `}

          </Text>
        </View>
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

  case 'image':
    return (
      <>
        {audio && <AudioCom src={audio} isPlay={play} />}
        <View style={styles.description}>
          <Text style={{
            textTransform: 'uppercase',
            color: '#ff1f1f',
            fontSize: RF(4),
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 3, height: 7 },
            textShadowRadius: 10,
            backgroundColor: '#0000007a',
            padding: 10,
            borderRadius: 7,
          }}
          >
            {`${activePrayerTime[0]?.name} in ${location} `}

          </Text>
        </View>
        <Stack flex='1' justifyContent='center' alignItems='center' bg='#ffffff'>
          <Image style={{ width: RW(100), height: RH(100) }} source={{ uri: BASE_URL + url.src }} />
        </Stack>
      </>
    );

  default:
    break;
  }
}

export default Azan;

const styles = StyleSheet.create({ description: { position: 'absolute', zIndex: 9999, width: RW(100), height: RH(100), justifyContent: 'center', alignItems: 'center' } });
