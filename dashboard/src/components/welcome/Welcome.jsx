import React from 'react';
import { useSelector } from 'react-redux';
import { stringFirstUp } from '../../utils/stringOpration';
import useAppLocation from '../../hook/useAppLocation';

/**
 * @param text string data
 * @returns  simple welcome message component
 */
function Welcome({ text }) {
  const location = useAppLocation();
  const { name } = useSelector((state) => state.user);
  return (
    <div>
      <h1 className='font-NunitoSans font-bold text-xl text-gray-700'>
        {text || location}
      </h1>
      <h2 className='text-tints-900 font-NunitoSans text-sm'>{`Welcome, ${stringFirstUp(name)}`}</h2>
    </div>
  );
}

export default Welcome;
