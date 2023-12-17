import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import AudioCom from '../../Audio/AudioCom';
import { sliderWidth } from '../../../constants/constants';
import { stopSlide } from '../../../rtk/features/navigation/navigationSlice';
import { useRunningTextAnimation } from '../../../hook/useRunningTextAnimation';
import NetError from '../../NetError/NetError';

let youtubeTimeout;
export function YoutubeCom({ uri, audio, duration }) {
  const youtube = useRef();
  const [play, setPlay] = useState(false);
  const mute = useSelector((state) => state.user.mute, shallowEqual);
  const dispatch = useDispatch();
  const animatedStyle = useRunningTextAnimation();
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    dispatch(stopSlide(true));

    if (duration) {
      youtubeTimeout = setTimeout(() => { dispatch(stopSlide(false)); }, duration);
    }
    return () => { setPlay(false); dispatch(stopSlide(false)); clearTimeout(youtubeTimeout); };
  }, []);

  const onStateChange = (state) => {
    if (!duration) {
      if (state === 'ended') dispatch(stopSlide(false));
    } else if (state === 'ended') {
      youtube?.current?.seekTo(0); setPlay(true);
    }
  };

  if (`${isInternetReachable}` === 'false') return <NetError />;

  return (
    <>
      {audio && <AudioCom src={audio} />}
      <Animated.View style={[animatedStyle, { width: sliderWidth }]}>
        <View style={{ position: 'absolute', height: '100%', width: '100%', zIndex: 9999 }} />
        <YoutubePlayer
          ref={youtube}
          height='100%'
          width='100%'
          play={play}
          videoId={uri}
          onChangeState={onStateChange}
          initialPlayerParams={{ controls: false, loop: true }}
          onReady={() => setPlay(true)}
          mute={audio ? true : mute}
        />
      </Animated.View>
    </>

  );
}
