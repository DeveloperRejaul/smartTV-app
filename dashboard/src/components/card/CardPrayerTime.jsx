import React from 'react';
import { convertTime, randomColor } from '../../utils/utils.fn';
import { MasjidLogo } from '../../assets/svg-icon';

function CardPrayerTime({ data }) {
  return (
    <div
      className='p-4 rounded shadow sm:max-w-[20rem] w-full '
      style={{ backgroundColor: randomColor() }}
    >
      <div className='flex justify-between text-xl h-2/3 w-full'>
        <div>
          <h2>{`${data.name} WAQTO`}</h2>
          <p>{convertTime(data?.time)}</p>
        </div>
        <MasjidLogo />
      </div>
      <div className='pt-5 flex w-full text-xs space-x-4'>
        <p className='border-r-2 pr-2'>{`${data.name === 'SYURUK'?'Start': 'Azan'} ${data?.azan || '00'}`}</p>
        <p className='border-r-2 pr-2'>{`${data.name === 'SYURUK'? 'End' : 'Iqamah'} ${data?.iqomah || '00'}`}</p>
      </div>
    </div>
  );
}

export default CardPrayerTime;
