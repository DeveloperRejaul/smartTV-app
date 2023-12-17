import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { ResizeMode, Video } from 'expo-av';
import { useNetInfo } from '@react-native-community/netinfo';
import { baseUrl, sliderWidth } from '../../../constants/constants';
import { stopSlide } from '../../../rtk/features/navigation/navigationSlice';
import AudioCom from '../../Audio/AudioCom';
import { useRunningTextAnimation } from '../../../hook/useRunningTextAnimation';
import NetError from '../../NetError/NetError';

const AnimatedVideo = Animated.createAnimatedComponent(Video);

let videoTimeout;
export function VideoCom({ uri, audio, duration }) {
  const isLink = uri.includes('http');
  const mute = useSelector((state) => state.user.mute, shallowEqual);
  const [play, setPlay] = useState(false);
  const dispatch = useDispatch();
  const animatedStyle = useRunningTextAnimation();
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    dispatch(stopSlide(true));
    if (duration) {
      videoTimeout = setTimeout(() => {
        dispatch(stopSlide(false));
      }, duration);
    }
    return () => { setPlay(false); dispatch(stopSlide(false)); clearTimeout(videoTimeout); };
  }, []);

  const onPlaybackStatusUpdate = useCallback((state) => {
    if (!duration) {
      if (state.didJustFinish) dispatch(stopSlide(false));
    }
  }, []);

  if (`${isInternetReachable}` === 'false') return <NetError />;

  return (
    <>
      {audio && <AudioCom src={audio} />}
      <AnimatedVideo
        style={[{ width: sliderWidth }, animatedStyle]}
        source={{ uri: isLink ? uri : `${baseUrl}upload/${uri}` }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay={play}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onReadyForDisplay={() => setPlay(true)}
        isMuted={audio ? true : mute}
      />
    </>
  );
}
