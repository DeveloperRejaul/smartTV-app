import React from 'react';
import { useSelector } from 'react-redux';
import { Image, StyleSheet, View, Text } from 'react-native';
import ClockCom from '../clock/ClockCom';
import { RF, RH, RW } from '../../constants/dimensions';
import { filePath } from '../../utils/FileOperation';
import { checkEqual } from '../../utils/selectorCheck';
import { fontsNames } from '../../constants/constants';
import { COLORS } from '../../constants/colors';

const AVATAR_SIZE = RH(15);
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const HEADER_HEIGHT = RH(16.66);

export default function Header02() {
  const { currentDate, currentHijriDate } = useSelector((state) => state.clock, checkEqual);
  const { name, location, avatar } = useSelector((state) => state.user, checkEqual);
  const { colors, fonts } = useSelector((state) => state.theme, checkEqual);

  return (
    <View style={[styles.container, { backgroundColor: colors?.solatBg }]}>
      <View>
        <ClockCom style={{ alignSelf: 'flex-start' }} />
        <View style={styles.dateBody}>
          <Text style={styles.date}>{currentDate}</Text>
          <Text style={styles.divider}>|</Text>
          <Text styles={[styles.hijiri, { fontFamily: fonts.hijriDateFont, color: colors?.hijriDateFontColor }]}>{currentHijriDate}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', columnGap: 5, marginLeft: 5 }}>
        <View style={styles.textBody}>
          <Text style={styles.name} noOfLines={1}>{name}</Text>
          <Text style={styles.location} numberOfLines={2}>{location}</Text>
        </View>
        <Image source={{ uri: filePath + avatar }} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', width: '100%', height: HEADER_HEIGHT, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2.5 },
  dateBody: { flexDirection: 'row', rowGap: RW(1), alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  date: { fontFamily: fontsNames.POPPINS_MEDIUM, fontWeight: 'normal', fontSize: RF(1.8), color: COLORS.black },
  divider: { fontFamily: fontsNames.POPPINS_MEDIUM, fontSize: RF(1.8), fontWeight: 'bold' },
  hijiri: { fontSize: RF(1.8) },
  textBody: { paddingX: 5, alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'column' },
  name: { fontFamily: fontsNames.POPPINS_MEDIUM, fontWeight: 'bold', fontSize: RF(2), color: 'black', textTransform: 'uppercase' },
  location: { fontFamily: fontsNames.POPPINS_MEDIUM, color: 'black', fontSize: RF(1.4), fontWeight: 'normal' },
  image: { height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_RADIUS },
});
