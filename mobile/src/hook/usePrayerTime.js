import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { activeTime, formatPrayerTime } from '../utils/prayerTime';
import { checkEqual } from '../utils/selectorCheck';

export default function usePrayerTime() {
  const [time, setTime] = useState(null);
  const { currentDate, currentTime } = useSelector((state) => state.clock, checkEqual);
  const { prayerTime } = useSelector((state) => state.user, checkEqual);

  useEffect(() => {
    const init = async () => {
      const formattedCurrentDate = currentDate.replace(/ /ig, '-');
      const currentPrayerTime = await prayerTime.filter((d) => d.date === formattedCurrentDate);
      setTime(activeTime(await formatPrayerTime(currentPrayerTime, currentTime)));
    };
    init();
  }, [currentDate]);

  return { time };
}
