import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { RH, RW } from '../../constants/dimensions';
import { checkEqual } from '../../utils/selectorCheck';
import { navigationType } from '../../constants/constants';
import { updateNavigation } from '../../rtk/features/navigation/navigationSlice';
import { hmTimeToMS } from '../../utils/timeConvater';
import { COLORS } from '../../constants/colors';

let timeout;
const day = (new Date()).getDay().toString();
export default function Sleep() {
  const { sleepingDay } = useSelector((state) => state.user, checkEqual);
  const activeSleeping = (sleepingDay || []).filter((dayObj) => dayObj?.day === day)[0];
  const startTime = activeSleeping?.start;
  const endTime = activeSleeping?.end;
  const stayTime = hmTimeToMS(endTime) - hmTimeToMS(startTime);
  const dispatch = useDispatch();

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updateNavigation(navigationType.HOME));
    }, stayTime);
    return () => clearTimeout(timeout);
  }, []);

  return <View style={{ height: RH(100), width: RW(100), backgroundColor: COLORS.black }} />;
}
