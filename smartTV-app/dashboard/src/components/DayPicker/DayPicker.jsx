import { useEffect, useState } from 'react';

export default function DayPicker({ onChange= () => {}, value }) {
  const [day, setDay]= useState(new Array(7).fill(false));
  useEffect(() => {
    if (value) {
      value.forEach((val) => setDay((prev) => {
        prev[val]=true;
        return [...prev];
      }));
    }
  }, [value]);

  useEffect(() => {
    const newArr =[];
    day.forEach((d, i) => {
      if (d===true) newArr.push(i);
    });
    onChange(newArr);
  }, [day]);

  return (

    <div>
      <h1 className='text-base font-medium text-grays-900 py-1'>Select Day</h1>
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            name='sun'
            checked={day[0]}
            onChange={(e) => setDay((prev) => {
              prev[0]=e.target.checked;
              return [...prev];
            })}
          />
          SUN
        </div>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            checked={day[1]}
            name='mon'
            onChange={(e) => setDay((prev) => {
              prev[1]=e.target.checked;
              return [...prev];
            })}
          />
          MON
        </div>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            name='tue'
            checked={day[2]}
            onChange={(e) => setDay((prev) => {
              prev[2]=e.target.checked;
              return [...prev];
            })}
          />
          TUE
        </div>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            name='wed'
            checked={day[3]}
            onChange={(e) => setDay((prev) => {
              prev[3]=e.target.checked;
              return [...prev];
            })}
          />
          WED
        </div>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            name='thu'
            checked={day[4]}
            onChange={(e) => setDay((prev) => {
              prev[4]=e.target.checked;
              return [...prev];
            })}
          />
          THU
        </div>
        <div className='flex items-center gap-1'>
          <input
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            type='checkbox'
            name='fri'
            checked={day[5]}
            onChange={(e) => setDay((prev) => {
              prev[5]=e.target.checked;
              return [...prev];
            })}
          />
          FRI
        </div>
        <div className='flex items-center gap-1'>
          <input
            type='checkbox'
            className='accent-tints-900 w-[18px] h-[18px] cursor-pointer'
            name='sat'
            checked={day[6]}
            onChange={(e) => setDay((prev) => {
              prev[6]=e.target.checked;
              return [...prev];
            })}
          />
          SAT
        </div>
      </div>
    </div>

  );
}
