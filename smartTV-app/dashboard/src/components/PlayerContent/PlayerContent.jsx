import React from 'react';
import Image from '../image/Image';
import { Calendar, Location, TableDelete, TableEdit } from '../../assets/svg-icon';

function PlayerContent({ data }) {
  return (
    <div>
      {data?.map((e) => (
        <div key={Math.random()} className='w-full flex items-center justify-between my-3 border-t-2 pt-3'>
          {/* Logo part */}
          <Image src={e.logoUrl} h={100} w={100} className='rounded-lg ' />

          {/* date part */}
          <div className='space-x-2 flex'>
            <Calendar className='stroke-gray-950' />
            <p className='text-gray-950'>{e.date }</p>
          </div>
          {/* Time part  */}
          <div
            className='px-[4%] flex'
          >
            {e.time}
          </div>

          {/* location part */}
          <div className=' text-tints-900 flex'>
            <Location className='h-6 w-6' />
            <p>{e.location}</p>
          </div>

          {/* action */}
          <div className='space-x-2 flex'>
            <TableEdit className='cursor-pointer stroke-gray-600 hover:stroke-blue-600 text-3xl w-6 h-6' />
            <TableDelete className='cursor-pointer fill-gray-600 hover:fill-red-500' />
          </div>
        </div>
      ))}

    </div>
  );
}

export default PlayerContent;
