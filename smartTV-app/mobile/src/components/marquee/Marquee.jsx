import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RF, RH } from '../../constants/dimensions';
import { fontsNames } from '../../constants/constants';

import { COLORS } from '../../constants/colors';
/**
 * @param {string} text
 * @param {string} bg
 * @param {number} bottom
 * @param {number} left
 * @param {number} right
 * @param {number} top
 * @param {number} bottom
 * @param {object} textStyle
 * @returns {React.JSX.Element}
 */

const SPEED = 15;
const MARQUE_HEIGHT = RH(6);
const ANIMATION_DURATION = 1000;

export default function Comp({ height, left, right, top, bottom, width }) {
  const { runningText, runningTextShow } = useSelector((state) => state.user);
  const colors = useSelector((state) => state.theme.colors);

  const scroll = useSharedValue(width);
  const marqueeHeight = useSharedValue(runningTextShow ? MARQUE_HEIGHT : 0);
  const [textWidth, setTextWidth] = useState(null);
  const [containerStyle, setContainerStyle] = useState({});

  const onLayout = (e) => setTextWidth(e.nativeEvent.layout.width);

  useEffect(() => {
    if (textWidth) {
      if (runningTextShow) {
        marqueeHeight.value = withTiming(MARQUE_HEIGHT, { duration: ANIMATION_DURATION });
        if (textWidth > width) {
          scroll.value = withRepeat(withTiming(-textWidth, { duration: (textWidth) * SPEED, easing: Easing.linear }), -1, false);
        } else {
          cancelAnimation(scroll);
        }
      } else {
        marqueeHeight.value = withTiming(0, { duration: ANIMATION_DURATION });
      }
      if (textWidth < width) setContainerStyle({ width, justifyContent: 'center', alignItems: 'center' });
      if (textWidth > width) setContainerStyle({});
    }
  }, [textWidth, runningTextShow, runningText]);

  const animatedStyle = useAnimatedStyle(() => {
    if (textWidth > width) {
      return {
        transform: [{ translateX: scroll.value }],
        height: marqueeHeight.value,
      };
    }

    return { transform: [{ translateX: 0 }] };
  });

  return (
    <View style={{ position: 'absolute', bottom, left, right, top, height, width }}>
      <ScrollView
        contentContainerStyle={containerStyle}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        style={{ backgroundColor: colors.runningTextBg ?? COLORS.red_500 }}
      >
        <Animated.Text
          onLayout={onLayout}
          style={[animatedStyle,
            {
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: (RF(2)),
              color: colors.runningTextFontColor ?? COLORS.white,
              fontFamily: fontsNames.POPPINS_MEDIUM,
            },
          ]}
        >
          {runningText}
        </Animated.Text>
      </ScrollView>
    </View>
  );
}
