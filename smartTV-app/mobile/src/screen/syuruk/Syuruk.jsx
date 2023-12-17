import React from 'react';
import { useSelector } from 'react-redux';
import { syurukNavigation } from '../../constants/constants';
import SyurukCountdown from './syurukCountdown';
import SyurukMain from './SyurukMain';
import SyurukEnd from './SyurukEnd';

const syurukScreen = {
  [syurukNavigation.COUNDOWN]: <SyurukCountdown />,
  [syurukNavigation.MAIN]: <SyurukMain />,
  [syurukNavigation.END]: <SyurukEnd />,
};

export default function Syuruk() {
  const syuruk = useSelector((state) => state.navigation.syuruk);

  return syurukScreen[syuruk];
}
