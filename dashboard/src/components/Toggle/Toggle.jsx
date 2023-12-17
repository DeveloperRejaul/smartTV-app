import { useEffect, useState } from 'react';

export default function Toggle({ name='toggle', callBack = () => {}, defaultValue=true, label1='OFF', label2='ON', width='w-[50px]', hide=false }) {
  const [isOn, setIsOn]= useState(defaultValue);
  useEffect(() => {
    setIsOn(defaultValue);
  }, [defaultValue]);
  return (
    <div className={`${hide===true? 'hidden':'false'}`}>
      <div className='flex items-center  border rounded cursor-pointer select-none' onClick={() => { callBack(name, !isOn); setIsOn((prev) => !prev); }}>
        <div className={`${isOn===false?'bg-tints-800 text-white font-[600]':'bg-slate-200'} px-2 py-1 rounded-l ${width}`}>{label1}</div>
        <div className={`${isOn===true?'bg-tints-800 text-white font-[600]':'bg-slate-200'} px-2 py-1 rounded-r ${width}`}>{label2}</div>

      </div>
    </div>
  );
}
