import { Dimensions } from 'react-native';
import { RF, RH } from '../../constants/dimensions';
import { sliderHeight } from '../../constants/constants';

export const { width, height } = Dimensions.get('screen');
export const MARGIN = RH(6);
export const TEXT_SIZE = RF(8);
export const TIME_NAME_SIZE = RF(4);
export const MARQUE_HEIGHT = RH(6);
export const FULL_SLIDE_HEIGHT = MARQUE_HEIGHT + sliderHeight;
export const EVENT_NAME_SIZE = RF(4);
