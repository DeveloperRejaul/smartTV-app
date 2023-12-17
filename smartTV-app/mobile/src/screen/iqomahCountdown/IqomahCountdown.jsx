import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { contentType, prayerNavigation } from '../../constants/constants';
import { checkEqual } from '../../utils/selectorCheck';
import { updatePrayerNavigation } from '../../rtk/features/navigation/navigationSlice';
import ClockCom2 from '../../components/clock/ClockCom2';
import AudioCom from '../../components/Audio/AudioCom';
import useTimer from '../../hook/useTimer';
import Countdown from '../../components/countdown/Countdown';

let timeout;
export default function IqomahCountdown() {
  const { activeContent } = useSelector((state) => state.content, checkEqual) || {};
  const isShow = useSelector((state) => state.screen?.screen?.iqomahCountdown);
  const iqomahCountdownTime = activeContent?.filter((d) => d.type === contentType.IQOMAH_COUNTDOWN)[0];
  const { minutes } = useTimer({ time: iqomahCountdownTime?.startTime / 60000, countDown: 'countDown' });

  const dispatch = useDispatch();
  const stayIqomahCountdown = iqomahCountdownTime?.startTime;

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updatePrayerNavigation(prayerNavigation.SALAT_PREPARE));
    }, stayIqomahCountdown);
    return () => clearInterval(timeout);
  }, []);

  return (
    <>
      { isShow ? (
        <>
          {iqomahCountdownTime?.audio && <AudioCom src={iqomahCountdownTime?.audio} />}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Countdown minutes={minutes} text='IQOMAH COUNTDOWN' />
            <ClockCom2 />
          </View>
        </>
      )
        : <View style={{ flex: 1, backgroundColor: '#000' }} />}
    </>

  );
}
