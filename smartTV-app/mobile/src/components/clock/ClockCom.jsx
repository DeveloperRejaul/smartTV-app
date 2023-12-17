import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { timeConvert } from '../../utils/timeConvater';
import { RF, RH, RW } from '../../constants/dimensions';
import { checkEqual } from '../../utils/selectorCheck';
import { fontsNames } from '../../constants/constants';

const WIDTH = RW(15);
const HEIGHT = RH(10);
const TEXT_SIZE = RF(2.5);

function ClockCom({ style = {} }) {
  const { currentTime } = useSelector((state) => state.clock);
  const { timeFormat } = useSelector((state) => state.user, checkEqual);
  const colors = useSelector((state) => state.theme.colors);
  return (
    <View style={{ width: WIDTH, height: HEIGHT, padding: 0, margin: 0, ...style }}>
      <Text
        style={{
          fontFamily: fontsNames.POPPINS_MEDIUM,
          padding: 0,
          margin: 0,
          fontWeight: 'bold',
          fontSize: TEXT_SIZE,
          color: colors?.solatFontColor,
          textTransform: 'uppercase',
        }}
      >
        { timeFormat === '12' ? timeConvert(currentTime) : currentTime}

      </Text>
    </View>
  );
}

export default ClockCom;
