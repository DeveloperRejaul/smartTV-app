import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Image, View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import ClockCom from '../clock/ClockCom';
import { RF, RH, RW } from '../../constants/dimensions';
import { filePath } from '../../utils/FileOperation';
import { S3HeaderH, fontsNames } from '../../constants/constants';
import { checkEqual } from '../../utils/selectorCheck';

const runningTextHeight = RH(6);
const headerHeight = S3HeaderH + runningTextHeight;
const ANIMATION_DURATION = 1000;
const AVATAR_SIZE = RH(15);
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const HEADER_WIDTH = RW(16.66);
const HIJIRI_TEXT_SIZE = RF(1.8);

export default function Header03() {
  const { currentDate, currentHijriDate } = useSelector((state) => state.clock, checkEqual);
  const { name, location, avatar } = useSelector((state) => state.user, checkEqual);
  const { colors, fonts } = useSelector((state) => state.theme, checkEqual);
  const isRunningText = useSelector((state) => state.user.runningTextShow, shallowEqual);
  const animatedHeight = useSharedValue(isRunningText ? S3HeaderH : headerHeight);

  useEffect(() => {
    if (isRunningText) animatedHeight.value = withTiming(S3HeaderH, { duration: ANIMATION_DURATION });
    if (!isRunningText) animatedHeight.value = withTiming(headerHeight, { duration: ANIMATION_DURATION });
  }, [isRunningText]);

  const animatedStyle = useAnimatedStyle(() => ({ height: animatedHeight.value }));

  return (
    <Animated.View style={[animatedStyle, styles.container, { backgroundColor: colors?.solatBg }]}>
      <View>
        <ClockCom style={{ alignSelf: 'flex-start' }} />
        <Text style={[styles.date, { color: colors?.solatFontColor }]}>
          {currentDate}
        </Text>
        <Text style={[styles.hijiri, { color: colors?.hijriDateFontColor, fontFamily: fonts.hijriDateFont }]}>
          {currentHijriDate}
        </Text>
      </View>
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.textBody}>
          <Text style={[styles.text, { color: colors?.solatFontColor }]} noOfLines={1}>
            {name}
          </Text>
          <Text style={styles.location} color={colors?.solatFontColor} numberOfLines={2}>
            {location}
          </Text>
          <View style={styles.imageBody}>
            <Image source={{ uri: filePath + avatar }} style={styles.image} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: { height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_RADIUS },
  text: { fontFamily: fontsNames.POPPINS_MEDIUM, fontWeight: 'bold', fontSize: RF(2), textTransform: 'uppercase' },
  textBody: { paddingVertical: 5, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' },
  location: { fontSize: RF(1.4), fontWeight: 'normal', fontFamily: fontsNames.POPPINS_MEDIUM },
  container: { flexDirection: 'column', width: HEADER_WIDTH, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0, paddingHorizontal: 5 },
  date: { fontFamily: fontsNames.POPPINS_MEDIUM, fontWeight: 'normal', fontSize: RF(1.8) },
  hijiri: { fontSize: HIJIRI_TEXT_SIZE },
  imageBody: { alignSelf: 'center', paddingTop: 2 },
});
