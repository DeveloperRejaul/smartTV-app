import React from 'react';
import { Logo as logo } from '../../assets/index';

/**
 * @param className string data type
 * @returns simple logo component
 */
function Logo({ className }) {
  return (
    <img src={logo} alt='Logo' className={` px-10 mb-5  mt-2   ${className}`} />
  );
}
export default Logo;
