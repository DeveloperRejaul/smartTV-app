import { useEffect, useState } from 'react';

export default function RadioToggle({ name='toggle', callBack = () => {}, defaultValue=true, label1='OFF', label2='ON', width='w-[50px]', hideSecond=false }) {
  const [isOn, setIsOn]= useState(defaultValue);
  useEffect(() => {
    setIsOn(defaultValue);
  }, [defaultValue]);
  return (
    <div className={`${hideSecond===true? 'pointer-events-none':''}`}>
      <div className='flex items-center cursor-pointer select-none' onClick={() => { callBack(name, !isOn); setIsOn((prev) => !prev); }}>
        <div className={` px-2 py-1 rounded-l ${width} flex items-center gap-1`}>
          <div className={`${isOn===true?'bg-tints-800 text-white font-[600]':'bg-slate-200'} w-[20px] h-[20px] rounded-full border-2`} />
          {label1}
        </div>
        <div className={` px-2 py-1 rounded-l ${width} flex items-center gap-1 ${hideSecond===true?'hidden': 'block'}`}>
          <div className={`${isOn===false?'bg-tints-800 text-white font-[600]':'bg-slate-200'} w-[20px] h-[20px] rounded-full border-2`} />
          {label2}
        </div>

      </div>
    </div>
  );
}
