import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';
import Clock from '../../components/clock/ClockCom2';
import { RF } from '../../constants/dimensions';
import { updateSyurukNavigation } from '../../rtk/features/navigation/navigationSlice';
import { baseUrl, contentType, fontsNames, syurukNavigation } from '../../constants/constants';
import AudioCom from '../../components/Audio/AudioCom';
import { checkEqual } from '../../utils/selectorCheck';
import { minuteToMS } from '../../utils/timeConvater';
import ImageBackground from '../../components/ImageBackground/ImageBackground';

const AnimatedText = Animated.createAnimatedComponent(Text);

let timeout;
export default function SyurukMain() {
  const { contents } = useSelector((state) => state.content, checkEqual) || {};
  const syurukMain = contents?.filter((d) => d.type === contentType.SYURUK_MAIN)[0];
  const syurukDuration = minuteToMS(syurukMain?.startTime / 60000);

  const translateX = useSharedValue(100);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(1);
  const dispatch = useDispatch();

  useEffect(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    opacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1, false);
    timeout = setTimeout(() => {
      dispatch(updateSyurukNavigation(syurukNavigation.END));
    }, syurukDuration);
    return () => clearTimeout(timeout);
  }, []);

  const animationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));
  const audio = syurukMain?.audio;

  return (
    <ImageBackground source={{ uri: baseUrl + syurukMain?.src }}>
      <View style={[styles.container, { backgroundColor: syurukMain?.src ? 'transparent' : COLORS.primary_500 }]}>
        { audio && <AudioCom src={audio} />}
        <Animated.View style={animationStyle}>
          <AnimatedText style={styles.text}> WAKTU </AnimatedText>
          <AnimatedText style={styles.text}> SYURUK </AnimatedText>
        </Animated.View>
        <Clock />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: RF(7),
    fontWeight: '800',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 3, height: 7 },
    textShadowRadius: 10,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
});
