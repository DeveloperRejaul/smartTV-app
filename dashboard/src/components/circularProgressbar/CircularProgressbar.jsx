import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { colors } from '../../constants/colors';

/**
 * @param percentage number data type
 * @param h number data type, this is hight props
 * @param w number data type, this is width props
 * @param strokeWidth number data type
 * @param stockColor string data type
 * @returns jsx CircularProgress component
 */
function CircularProgress({ percentage, h, w, strokeWidth, stockColor }) {
  return (
    <div style={{ height: h, width: w }} className='absolute'>
      <CircularProgressbar
        value={percentage}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          pathColor: colors.white,
          trailColor: stockColor,
        })}
      />
    </div>
  );
}

export default CircularProgress;

