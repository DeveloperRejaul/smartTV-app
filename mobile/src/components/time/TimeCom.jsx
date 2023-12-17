import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { View, Text } from 'react-native';
import { BoxHeight, BoxWidth, S3ClockH } from '../../constants/constants';
import { RF, RW } from '../../constants/dimensions';
import { checkEqual } from '../../utils/selectorCheck';
import { hmToMinutes, timeConvert } from '../../utils/timeConvater';
import { COLORS } from '../../constants/colors';

const AnimatedText = Animated.createAnimatedComponent(Text);
const SCREEN_BOX_WIDTH = RW(16.66);
const prayerNames = ['SUBUH', 'SYURUk', 'ZOHOR', 'ASAR', 'MAGHRIB', 'ISYAK'];

export default function TimeCom({ screen03 }) {
  const opacity = useSharedValue(1);
  const timeFormat = useSelector((state) => state.user?.timeFormat, shallowEqual);
  const { colors, fonts } = useSelector((state) => state.theme, checkEqual);
  const currentTime = useSelector(((state) => state.clock.currentTime));
  const blinkTime = useSelector((state) => state.screen.blinksBeforeAzan);
  const times = useSelector((state) => state.content.times, checkEqual);
  const activeIndex = times.findIndex((time) => time.active);
  const nextPrayerIndex = activeIndex === times.length - 1 ? 0 : activeIndex + 1;
  const nextPrayerTime = times[nextPrayerIndex]?.time;

  const currentMinutes = hmToMinutes(currentTime);
  const nextPrayerStartTime = hmToMinutes(nextPrayerTime) - blinkTime;
  const nextMinutes = hmToMinutes(nextPrayerTime);

  useEffect(() => {
    if (currentMinutes >= nextPrayerStartTime && currentMinutes <= nextMinutes) { opacity.value = withRepeat(withTiming(0, { duration: 1000 }), -1, false); }
    if (currentMinutes <= nextPrayerStartTime && currentMinutes >= nextMinutes) { cancelAnimation(opacity); opacity.value = 1; }
  }, [currentMinutes, nextPrayerStartTime, nextMinutes]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View
      style={{
        width: screen03 && '100%',
        flexDirection: screen03 && 'row',
        backgroundColor: colors?.solatBg,
      }}
    >
      {prayerNames.map((name, i) => (
        <View
          key={Math.random()}
          style={{
            borderRightColor: COLORS.black,
            width: screen03 ? SCREEN_BOX_WIDTH : BoxWidth,
            borderLeftWidth: 1,
            height: screen03 ? S3ClockH : BoxHeight,
            backgroundColor: i === activeIndex ? colors.activeSolatBg : i === nextPrayerIndex ? colors.nextSolatBg : null,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: 'black',
          }}

        >

          <AnimatedText style={[{
            textTransform: 'uppercase',
            color: i === activeIndex ? colors.activeSolatFontColor : i === nextPrayerIndex ? colors.nextSolatFontColor : colors.solatFontColor,
            fontFamily: i === nextPrayerIndex ? fonts.nextSolatTimeFont : i === activeIndex ? fonts.activeSolatTimeFont : fonts.solatTimeFont,
            fontSize: RF(1.6),
          }, i === nextPrayerIndex ? animatedStyle : null]}
          >
            {timeFormat === '12' ? timeConvert(times[i]?.time) : times[i]?.time.slice(0, -3)}
          </AnimatedText>
          <AnimatedText
            style={[{
              textTransform: 'uppercase',
              fontFamily: i === nextPrayerIndex ? fonts.nextSolatTimeFont : i === activeIndex ? fonts.activeSolatTimeFont : fonts.solatTimeFont,
              color: i === activeIndex ? colors.activeSolatFontColor : i === nextPrayerIndex ? colors.nextSolatFontColor : colors.solatFontColor,
              fontSize: RF(1.4),
            }, i === nextPrayerIndex ? animatedStyle : null]}
          >
            {name}
          </AnimatedText>

        </View>
      ))}
    </View>
  );
}
