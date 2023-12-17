import React from 'react';

/**
 *
 * @param src staring data type . Image url
 * @param h number data type
 * @param w number data type
 * @param className string data type
 * @returns
 */
function Image({ src, h, w, className }) {
  return (
    <div style={{ height: h, width: w }} className={`${className} overflow-hidden`}>
      <img src={src} alt='img' className='object-cover h-full w-full' />
    </div>
  );
}

export default Image;
