import React, { useEffect, useRef, useState } from 'react';
import { Down } from '../../assets/svg-icon';

const defaultValue = 'Select';

/**
 * @param error Boolean data type
 * @param items Array data , Object data type
 * @param label string data type
 * @param value string data type
 * @param onSelect callback function
 * @param className string data type , style for label body
 * @param bodyStyle string data type , style for body
 * @param itemStyle string data type , style for item
 * @returns jsx Dropdown component
 */
function Dropdown({ error, items = [], label, value, disable, onSelect, className, itemStyle, bodyStyle, onKayData, isSplit }) {
  const [toggle, setToggle] = useState(false);
  const modalRef = useRef();
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setToggle(false);
      }
    };
    toggle ? document.addEventListener('mousedown', handleOutsideClick) : document.removeEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [toggle]);

  return (
    <div className={`select-none ${className}`} ref={modalRef}>
      <label className='text-base font-medium text-grays-900'>{label}</label>
      <div
        className={`${bodyStyle}  ${disable?'bg-gray-200':''} cursor-pointer border-2 border-tints-50 flex justify-between items-center rounded-md px-3 py-1 ${
          error && 'border-error'
        }`}
        onClick={(e) => { e.stopPropagation(); !disable && setToggle((pre) => !pre); }}
      >
        <p className='font-NunitoSans p-0'>{value || defaultValue}</p>
        <div className='w-5 h-4 bg-gray-200 rounded flex justify-center items-center cursor-pointer'>
          <Down className='fill-gray-600' />
        </div>
      </div>

      <div className='relative'>
        <ul className={`${itemStyle || 'dropdown-scroll'} rounded-md max-h-48 overflow-y-scroll flex flex-col py-1 bg-white border p-3 absolute top-1 left-0 right-0 ${toggle===true?'block':'hidden'} z-50`} style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
          {toggle
            && items.map((e) => {
              if (isSplit && e.includes(':')) {
                const [part1, part2] = e.split(':');
                return (
                  <li
                    className='cursor-pointer hover:bg-tints-100/50 my-1 rounded-md px-4 py-1 hover:text-black hover:font-[600] '
                    onClick={() => {
                      setToggle(false);
                      onSelect(part2);
                      onKayData(part1);
                    }}
                    key={Math.random()}
                  >
                    {part2}
                  </li>
                );
              }
              return (
                <li
                  className='cursor-pointer  hover:bg-tints-100/50 my-1 rounded-md px-4 py-1 hover:text-black hover:font-[600]  '
                  onClick={() => {
                    setToggle(false);
                    onSelect(e);
                  }}
                  key={Math.random()}
                >
                  {e}
                </li>
              );
            })}
        </ul>
      </div>
      {
        error? <p className='text-error'>{error}</p>:''
      }

    </div>
  );
}

export default Dropdown;
