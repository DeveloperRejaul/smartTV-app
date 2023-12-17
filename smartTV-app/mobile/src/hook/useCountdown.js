import { useEffect, useState } from 'react';

export function useCountdownTimer(initialMinutes) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [goTo, setGoto] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(intervalId);
          setGoto(true);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  return {
    hours: Math.floor(seconds / 3600).toString().padStart(2, '0'),
    minutes: Math.floor((seconds / 60) % 60).toString().padStart(2, '0'),
    seconds: (seconds % 60).toString().padStart(2, '0'),
    goTo,
  };
}
