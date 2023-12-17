import { StyleSheet } from 'react-native';
import { RF, RH, RW } from '../constants/dimensions';

export const styles = StyleSheet.create({
  mask: { height: RH(27), width: RW(70) },
  maskTextBody: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  maskText: {
    color: '#000',
    fontSize: RF(10),
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: RF(2),
    marginBottom: -10,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: RF(5),
  },
  progress: {
    marginTop: 10,
  },
});
