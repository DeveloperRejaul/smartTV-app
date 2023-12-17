import { StyleSheet } from 'react-native';
import { RH, RW, RF } from '../../constants/dimensions';

export const styles = StyleSheet.create({
  mask: { height: RH(15), width: RW(70) },
  maskTextBody: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  maskText: {
    color: '#000',
    fontSize: RF(3),
    fontWeight: 'bold',
  },
  colorView: { flex: 1, flexDirection: 'row' },
  container: {
    height: RH(100), width: RW(100), justifyContent: 'center', alignItems: 'center',
  },
  time: {
    width: RW(8), height: RH(20), backgroundColor: '#343434', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  dot: {
    width: RW(1.5), height: RW(1.5), backgroundColor: '#343434', borderRadius: 100,
  },
  dotBody: { width: RW(1), height: RH(15) },
  timeText: { fontSize: RF(7), color: '#fff', fontWeight: 'bold' },
});
