import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { shallowEqual, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { sliderHeight } from '../constants/constants';
import { FULL_SLIDE_HEIGHT } from '../components/customSlider/constants';

export const useRunningTextAnimation = () => {
  // animated height calculate
  const isRunningText = useSelector((state) => state.user.runningTextShow, shallowEqual);
  const slideHeight = useSharedValue(isRunningText ? sliderHeight : FULL_SLIDE_HEIGHT);

  useEffect(() => {
    if (!isRunningText) slideHeight.value = withTiming(FULL_SLIDE_HEIGHT, { duration: 1000 });
    if (isRunningText) slideHeight.value = withTiming(sliderHeight, { duration: 1000 });
  }, [isRunningText]);

  return useAnimatedStyle(() => ({ height: slideHeight.value }));
};
