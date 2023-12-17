import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { timeConvert } from '../../utils/timeConvater';
import { COLORS } from '../../constants/colors';
import { RF, RH, RW } from '../../constants/dimensions';
import { fontsNames } from '../../constants/constants';

export default function ClockCom2() {
  const { currentTime } = useSelector((state) => state.clock) || {};
  const date = moment().format('DD MMMM YYYY');
  const [time, indecator] = timeConvert(currentTime)?.split(' ') || [];

  return (
    <View style={styles.container}>
      <View style={styles.timeBody}>
        <Text style={styles.time}>
          {time}
        </Text>
        <Text style={styles.indecator}>
          {indecator}
        </Text>
      </View>
      <Text style={styles.selasa}>
        {`${date} - Selasa`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  time: { color: COLORS.white,
    fontSize: RF(3.5),
    textTransform: 'uppercase',
    fontFamily: fontsNames.POPPINS_MEDIUM,
    letterSpacing: 1,
  },
  indecator: { fontFamily: fontsNames.POPPINS_MEDIUM, color: COLORS.white, fontSize: RF(2), textTransform: 'uppercase' },
  selasa: { fontFamily: fontsNames.POPPINS_MEDIUM, color: COLORS.white, fontSize: RF(1.5), textTransform: 'uppercase' },
  container: { position: 'absolute', backgroundColor: '#0000007a', paddingVertical: RH(0.5), borderRadius: 5, bottom: RH(3), left: RW(3), paddingHorizontal: RW(1) },
  timeBody: { flexDirection: 'row', alignItems: 'flex-end', columnGap: RH(1) },
});
