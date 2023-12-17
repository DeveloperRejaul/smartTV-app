import React, { useEffect, useRef, useState } from 'react';
import { Box, Progress } from 'native-base';

let intervalId;
const progressDone = 100;
const interval = 1000;

/**
 * @param {number} width
 * @param {number} height
 * @param {string} time
 * @param {boolean} isIncrement
 * @param {JSX} children
 * @param {object} children
 * @returns
 */
export default function ProgressBarCom({
  isIncrement, time, width, height, children, style = {},
}) {
  const totalTime = useRef(time);

  const progressValue = isIncrement ? 0 : 100;
  const [progressPercentage, setProgressPercentage] = useState(progressValue);

  useEffect(() => {
    const totalTimeSM = totalTime.current * 60 * 1000;
    const increment = progressDone / (totalTimeSM / interval);
    intervalId = setInterval(() => {
      isIncrement
        ? setProgressPercentage((pre) => pre + increment)
        : setProgressPercentage((pre) => pre - increment);
    }, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (progressPercentage > 100) clearInterval(intervalId);
    if (progressPercentage < 0) clearInterval(intervalId);
  }, [progressPercentage]);

  return (
    <Box position='relative' style={{ width, height, ...style }}>
      <Progress
        justifyContent='center'
        value={progressPercentage}
        size='xl'
        colorScheme='secondary'
        bg='#e3d187'
        style={{ width, height }}
      >
        {children}
      </Progress>
    </Box>
  );
}
