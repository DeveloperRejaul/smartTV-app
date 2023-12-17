import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @param text string data type
 * @param className string data type
 * @param path string data type
 * @param normalText string data type
 * @returns jsx Link component
 */
function LinkCom({ text, className, path, normalText }) {
  return (
    <div className={` font-NunitoSans  flex ${className}`}>
      <p className='text-grays-500 pr-2'>{normalText}</p>
      <Link to={path} className='font-medium text-tints-900 block'>
        {text}
      </Link>
    </div>
  );
}

export default LinkCom;
