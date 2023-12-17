import { StyleSheet } from 'react-native';
import { window } from '../../constants/constants';

export const PAGE_WIDTH = window.width;
export const PAGE_HEIGHT = window.height;

export const styles = StyleSheet.create({
  carousel: {
    justifyContent: 'center', alignItems: 'center', height: PAGE_HEIGHT, width: PAGE_WIDTH,
  },
  body: {
    height: PAGE_HEIGHT, width: PAGE_WIDTH, backgroundColor: '#cffafe', overflow: 'hidden',
  },
});
