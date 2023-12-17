import React from 'react';

/**
 * @param {string} url string data type , image uri
 * @param {string} text  string data type
 * @param {string} sizeStyle string data type
 * @returns
 */

function Avatar({ url, text, sizeStyle }) {
  return (
    <div className='flex items-center space-x-4 justify-center'>
      <img src={url} alt='userImage' className={`rounded-full w-12 h-12 ${sizeStyle}`} />
      {text && (
        <div className='font-medium text-white'>
          <dev>{text}</dev>
        </div>
      )}
    </div>
  );
}

export default Avatar;
