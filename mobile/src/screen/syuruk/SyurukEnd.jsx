import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';
import { RF, RH, RW } from '../../constants/dimensions';
import ClockCom2 from '../../components/clock/ClockCom2';
import { useCountdownTimer } from '../../hook/useCountdown';
import { updateNavigation } from '../../rtk/features/navigation/navigationSlice';
import { contentType, fontsNames, navigationType } from '../../constants/constants';
import AudioCom from '../../components/Audio/AudioCom';
import { checkEqual } from '../../utils/selectorCheck';

function Times({ min }) {
  const { hours, minutes, seconds, goTo } = useCountdownTimer(min / 60000);
  const dispatch = useDispatch();

  useEffect(() => {
    if (goTo) dispatch(updateNavigation(navigationType.HOME));
  }, [goTo]);
  return (
    <View style={styles.timeContainer}>
      <Text style={styles.time}>{ hours }</Text>
      <View style={styles.border} />
      <Text style={styles.time}>{minutes}</Text>
      <View style={styles.border} />
      <Text style={styles.time}>{seconds}</Text>
    </View>
  );
}

// let timeout;
export default function SyurukEnd() {
  const { contents } = useSelector((state) => state.content, checkEqual) || {};
  const syurukEnd = contents?.filter((d) => d.type === contentType.SYURUK_END)[0];
  const audio = syurukEnd?.audio;

  return (
    <View style={styles.container}>
      {audio && <AudioCom src={audio} />}
      <View style={styles.nameBody}>
        <Text style={styles.name}>waktu tahrim</Text>
      </View>
      <View style={styles.subTextBody}>
        <Text style={styles.subText}>waktu diharamkan solat </Text>
      </View>
      <Times min={syurukEnd?.startTime} />
      <View style={styles.timeNameContainer}>
        <Text style={styles.timeName}>HOUR</Text>
        <View />
        <Text style={styles.timeName}>MINIT</Text>
        <View />
        <Text style={styles.timeName}>SAAT</Text>
      </View>
      <Text style={styles.footerText}> Sila  solat selepas ini.....</Text>
      <ClockCom2 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.red_400,
    flex: 1,
    alignItems: 'center',
    paddingTop: RH(5),
  },
  nameBody: {
    backgroundColor: COLORS.red_900,
    paddingHorizontal: RW(2),
    paddingVertical: RH(2),
    borderRadius: 10,
  },
  name: {
    fontSize: RF(3.5),
    textTransform: 'uppercase',
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: RW(4),
  },
  border: {
    width: RW(0.2),
    height: '50%',
    backgroundColor: COLORS.white,
  },
  time: {
    fontSize: RF(7),
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeName: {
    fontSize: RF(3),
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: RW(3.5),
    marginTop: -RH(3),
  },
  subTextBody: {
    marginTop: RH(2),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    paddingHorizontal: RW(2),
    paddingVertical: RH(0.2),
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  subText: {
    fontSize: RF(3),
    textTransform: 'uppercase',
    color: COLORS.black,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  footerText: {
    backgroundColor: COLORS.yellow,
    borderRadius: 5,
    paddingHorizontal: 2,
    marginVertical: 1,
    fontSize: RF(2.5),
    textTransform: 'uppercase',
    marginTop: RH(1),
    letterSpacing: 5,
    color: COLORS.red_800,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
});
