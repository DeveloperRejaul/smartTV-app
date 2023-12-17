import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdjustableInput({ defaultValue=0, setValue = () => {}, name='adjustableTime', onChange = () => {}, max, min }) {
  const [value, setvalue]= useState(defaultValue);
  useEffect(() => {
    setValue(name, Number(value));
    onChange(Number(value));
  }, [value]);
  const handleValue = (e) => {
    if (max && e>max) {
      toast.error(`Value must be less than ${max}`);

      return;
    }
    if (min!==null && e<min) {
      toast.error(`Value must be greater than ${min}`);
      return;
    }
    setvalue(e);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  };

  const handleInc = () => {
    if (max && value===max) {
      toast.error(`Value must be less than ${max}`);
      return;
    }
    setvalue((prev) => Number(prev)+1);
  };

  const handleDec = () => {
    if (min!==null && value===min) {
      toast.error(`Value must be greater than ${min}`);

      return;
    }
    setvalue((prev) => Number(prev)-1);
  };
  return (
    <div className='flex items-center gap-2 sm:gap-5'>
      <div className='py-2 px-3 sm:px-5 rounded font-[600] bg-tints-700 text-white active:scale-95 hover:bg-tints-800 active:bg-tints-800 cursor-pointer select-none' type='btn' onClick={() => handleDec()}>-</div>
      <input type='number' className='border  rounded p-2 sm:w-[100px] w-[50px] text-center' value={value} onKeyPress={handleKeyPress} onChange={(e) => handleValue(e.target.value)} />
      <div className='py-2 px-3 sm:px-5 rounded font-[600] bg-tints-700 text-white active:scale-95 hover:bg-tints-800 active:bg-tints-800 cursor-pointer select-none' type='btn' onClick={() => handleInc()}>+</div>
    </div>

  );
}
