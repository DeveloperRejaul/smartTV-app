import moment from 'moment';
import { useEffect, useState } from 'react';

let intervalId;
export default ({ countDown, countUp, time }) => {
  const [minutes, setMinutes] = useState('0000');

  useEffect(() => {
    if (countUp) {
      const startDate = new Date().getTime();
      intervalId = setInterval(() => {
        const currentDate = new Date().getTime();
        const timeDiff = currentDate - startDate;
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setMinutes(`${minutes}${seconds}`);
      }, 1000);
    }
    if (countDown) {
      const countdownDuration = time * 60 * 1000;
      const targetTime = moment().add(countdownDuration, 'milliseconds');
      intervalId = setInterval(() => {
        const now = moment();
        const timeRemaining = targetTime.diff(now);
        if (timeRemaining <= 0) {
          clearInterval(intervalId);
        } else {
          const minutes = moment.duration(timeRemaining).minutes().toString().padStart(2, '0');
          const seconds = moment.duration(timeRemaining).seconds().toString().padStart(2, '0');
          setMinutes(`${minutes}${seconds}`);
        }
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { minutes };
};
