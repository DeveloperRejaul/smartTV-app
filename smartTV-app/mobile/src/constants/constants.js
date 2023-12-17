import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { BASE_URL } from '@env';
import { RH, RW } from './dimensions';

export const BoxHeight = RH(100) / 7.2;
export const BoxWidth = RW(100) / 7;
export const sliderWidth = RW(100) - BoxWidth;
export const sliderHeight = RH(91) - BoxHeight;
export const window = Dimensions.get('window');

// base url
export const baseUrl = BASE_URL;

// This only for 3 no home screen
export const S3HeaderH = RH(77);
export const S3ClockH = (RH(100) - S3HeaderH) - RH(6);
export const MRQH = RH(100) - (S3ClockH + S3HeaderH);

// template const
export const template = { one: 'one', two: 'two', three: 'three' };

// filesystem base path
export const basePath = FileSystem.documentDirectory;

// content type
export const contentType = {
  AZAN_COUNTDOWN: 'azanCountdown', AZAN: 'azan', IQOMAH_COUNTDOWN: 'iqomahCountdown', IQOMAH: 'iqomah', SALAT_SLIDE: 'salatSlide', PRAYER_TIME: 'prayerTime', SALAT: 'salat', SLIDE: 'slide', KHUTBAH: 'khutbah', SYURUK_COUNTDOWN: 'syurukCountDown', SYURUK_MAIN: 'syurukMain', SYURUK_END: 'syurukEnd',
};

export const parayerTime = {
  fajr: 'SUBUH',
  syuruk: 'SYURUK',
  dhuhr: 'ZOHOR',
  asr: 'ASAR',
  maghrib: 'MAGHRIB',
  isha: 'ISYAK',
};

// all home naviation
export const navigationType = { HOME: 'home', PRAYER: 'prayer', SLEEP: 'sleep', SYURUK: 'syuruk' };

// root prayer navigation all name
export const prayerNavigation = {
  AZAN_COUNTDOWN: 'azanCountdown',
  AZAN: 'azan',
  IQOMAH_COUNTDOWN: 'iqomahCountdown',
  IQOMAH: 'iqomah',
  SALAT_PREPARE: 'salatPrepare',
  SALAT: 'satat',
  KHOTBAH: 'khotbah',
};

export const syurukNavigation = {
  COUNDOWN: 'coundown',
  MAIN: 'main',
  END: 'end',
};

export const asyncKeys = {
  token: '@token',
  salatSlide: '@salatSlide',
  masjid: '@masjid',
};

export const fontsNames = {
  POPPINS_MEDIUM: 'Poppins-Medium',
  LIBREBASKERVILLE_REGULAR: 'LibreBaskerville-Regular',
  METROPHOBIC_REGULAR: 'Metrophobic-Regular',
  OSWALD_VARIABLEFONT: 'Oswald-VariableFont',
  FJALLAONE_REGULAR: 'FjallaOne-Regular',
  RALEWAY_REGULAR: 'Raleway-Regular',
  KALAM_REGULAR: 'Kalam-Regular',
  ELECTROLIZE_REGULAR: 'Electrolize-Regular',
  AUDIOWIDE_REGULAR: 'Audiowide-Regular',
  ADVENTPRO_REGULAR: 'AdventPro-Regular',
};

export const hijiriMonthName = { 1: 'Muh', 2: 'Saf', 3: 'Raw', 4: 'Rak', 5: 'Jaw', 6: 'Jak', 7: 'Rej', 8: 'Syb', 9: 'Ram', 10: 'Syw', 11: 'Zkh', 12: 'Zhj' };
