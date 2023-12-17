import React from 'react';
import Logo from '../logo/Logo';

/**
 * @param title string data type
 * @param subTitle string data type
 * @param className string data type
 * @returns jsx
 */
function LogoHeader({ title, subtitle, className }) {
  return (
    <div
      className={`flex justify-center flex-col items-center pb-6 ${className}`}
    >
      <div className='w-[300px] sm:w-[400px]'><Logo /></div>
      {title && (
        <h1 className='text-gray-900 font-bold text-3xl mb-3 font-NunitoSans text-center'>
          {title}
        </h1>
      )}
      {subtitle && (
        <h2 className='text-grays-600 font-NunitoSans text-sm text-center'>{subtitle}</h2>
      )}
    </div>
  );
}

export default LogoHeader;
