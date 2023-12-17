import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Prayer from '../../../layout/Prayer';
import { contentType, parayerTime } from '../../../constants/constants';
import ClockCom2 from '../../../components/clock/ClockCom2';
import AudioCom from '../../../components/Audio/AudioCom';
import { AZAN_NEV_SCREEN } from '../constants/constants';
import { checkEqual } from '../../../utils/selectorCheck';
import { azanNev } from '../slices/azan';

let timeout;
let audioTimeout;
export default function AzanCountdown() {
  const { nextPrayerContents } = useSelector((state) => state.content, checkEqual) || {};
  const azanCountdown = nextPrayerContents?.filter((d) => d.type === contentType.AZAN_COUNTDOWN)[0];
  const stayCountdown = azanCountdown?.startTime + 5000;
  const { nextPrayerTime } = useSelector((state) => state.content, checkEqual);
  const dispatch = useDispatch();
  const [isAudioPlay, setIsAudioPlay] = useState(true);

  useEffect(() => {
    if (azanCountdown?.startTime) {
      timeout = setTimeout(() => {
        dispatch(azanNev(AZAN_NEV_SCREEN.AZAN));
      }, stayCountdown);
      audioTimeout = setTimeout(() => {
        setIsAudioPlay(false);
      }, azanCountdown?.startTime);
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(audioTimeout);
    };
  }, []);

  return (
    <>
      {azanCountdown?.audio && <AudioCom src={azanCountdown?.audio} isPlay={isAudioPlay} />}
      <Prayer name={parayerTime[nextPrayerTime?.name]} time={azanCountdown?.startTime / 60000} />
      <ClockCom2 />
    </>
  );
}
