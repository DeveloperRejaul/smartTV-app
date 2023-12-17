import React, { useState } from 'react';
import { Eye, EyeOff } from '../../assets/svg-icon';

/**
 * @param label string data type
 * @param placeholder string data type
 * @param error string data type
 * @param icon boolean data type
 * @param type string data type
 * @param register object data type
 * @param defaultValue string data type
 * @param disabled boolean data type
 * @returns jsx
 */
function TextInput({
  label, placeholder, error=null, icon, type, register=() => {}, defVal, className='', disabled, required, EndIcon, EndIconStyle='', ...rest
}) {
  const [hidden, setHidden] = useState(type);

  return (
    <div className='w-full flex flex-col'>
      <label className='text-base font-medium text-grays-900'>{label}</label>
      <div
        className={` border-2 border-tints-50 flex rounded-md px-1 py-1 ${error && 'border-error'} ${className}`}
      >
        <input
          type={hidden}
          className={`focus:outline-0 font-NunitoSans p-0 ${icon ? 'w-[90%]' : 'w-full'}`}
          placeholder={placeholder}
          contentEditable='false'
          {...register}
          defaultValue={defVal}
          disabled={disabled}
          required={required}
          {...rest}
        />
        {icon && (
          <div
            className='flex flex-1 justify-center items-center ml-2 cursor-pointer'
            onClick={() => setHidden((pre) => (pre === 'password' ? 'text' : 'password'))}
          >
            {hidden === 'password' ? <EyeOff className='text-xl' /> : <Eye className='text-xl' />}
          </div>
        )}
        {
          EndIcon && <EndIcon className={EndIconStyle} />
        }
      </div>
      {error && <span className=' text-error'>{error}</span>}
    </div>
  );
}

export default TextInput;
