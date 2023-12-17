import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';
import { RF, RH, RW } from '../../constants/dimensions';
import ClockCom2 from '../../components/clock/ClockCom2';
import { useCountdownTimer } from '../../hook/useCountdown';
import { updateSyurukNavigation } from '../../rtk/features/navigation/navigationSlice';
import { contentType, fontsNames, syurukNavigation } from '../../constants/constants';
import AudioCom from '../../components/Audio/AudioCom';
import { checkEqual } from '../../utils/selectorCheck';

function Times({ min }) {
  const dispatch = useDispatch();
  const { hours, minutes, seconds, goTo } = useCountdownTimer(min / 60000);

  useEffect(() => {
    if (goTo) dispatch(updateSyurukNavigation(syurukNavigation.MAIN));
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

export default function SyurukCountdown() {
  const { contents } = useSelector((state) => state.content, checkEqual) || {};
  const syurukCountdown = contents?.filter((d) => d.type === contentType.SYURUK_COUNTDOWN)[0];
  const audio = syurukCountdown?.audio;

  return (
    <View style={styles.container}>
      {audio && <AudioCom src={audio} />}
      <View style={styles.nameBody}>
        <Text style={styles.name}>Syruruk</Text>
      </View>
      <Times min={+syurukCountdown?.startTime} />
      <View style={styles.timeNameContainer}>
        <Text style={styles.timeName}>HOUR</Text>
        <View />
        <Text style={styles.timeName}>MINIT</Text>
        <View />
        <Text style={styles.timeName}>SAAT</Text>
      </View>
      <ClockCom2 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary_800,
    flex: 1,
    alignItems: 'center',
    paddingTop: RH(5),
  },
  nameBody: {
    backgroundColor: COLORS.red_900,
    paddingHorizontal: RW(3),
    paddingVertical: RH(2),
    borderRadius: 10,
  },
  name: {
    fontSize: RF(6),
    textTransform: 'uppercase',
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: RH(3),
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: RW(4),
  },
  border: {
    width: RW(0.2),
    height: '60%',
    backgroundColor: COLORS.white,
  },
  time: {
    fontSize: RF(9),
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeName: {
    fontSize: RF(4),
    color: COLORS.white,
    fontFamily: fontsNames.POPPINS_MEDIUM,
  },
  timeNameContainer: {
    flexDirection: 'row',
    marginTop: RH(3),
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: RW(4),
  },
});
