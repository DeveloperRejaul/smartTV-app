import React from 'react';

/**
 *
 * @param title string data type
 * @param number string data type
 * @param color string data type
 * @param subTitle string data type
 * @param className string data type
 * @param border string data type
 * @returns jsx Card Component
 */
function Card({ title, number, color, subTitle, className, border }) {
  return (

    <div className={`mr-5 w-full  flex mb-4 ${border || 'md:border-r-2 border-b-2 md:border-b-0'} border-r-gray-200 ${className}`}>
      <div>
        <p className='text-gray-800 font-NunitoSans font-medium xl:text-lg text-md'>
          { title}
        </p>
        <div className='flex items-center space-x-2'>
          <p className='text-gray-700  font-NunitoSans text-xl font-bold'>{number}</p>
          <div className={`h-2 w-2 rounded-full ${color}`} />
        </div>
        <p className='text-gray-700 text-sm font-medium font-NunitoSans'>{ subTitle}</p>
      </div>
    </div>

  );
}

export default Card;
