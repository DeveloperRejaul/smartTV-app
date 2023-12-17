import Animated from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { sliderWidth } from '../../../constants/constants';
import { stopSlide } from '../../../rtk/features/navigation/navigationSlice';
import AudioCom from '../../Audio/AudioCom';
import { filePath } from '../../../utils/FileOperation';
import { useRunningTextAnimation } from '../../../hook/useRunningTextAnimation';

let timeout;

export function ImageCom({ uri, audio, duration }) {
  const dispatch = useDispatch();
  const animatedStyle = useRunningTextAnimation();

  useEffect(() => {
    dispatch(stopSlide(true));
    timeout = setTimeout(() => {
      dispatch(stopSlide(false));
    }, duration);

    return () => { clearTimeout(timeout); };
  }, [uri]);

  return (
    <>
      {audio && <AudioCom src={audio} />}
      <Animated.Image source={{ uri: filePath + uri }} style={animatedStyle} width={sliderWidth} />
    </>
  );
}
