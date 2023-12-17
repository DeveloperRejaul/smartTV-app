import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Duration({ label='Duration', onChange = () => {}, defaultValue=60000 }) {
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const handleInputCheck = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
  };
  useEffect(() => {
    const timeInMs = (Number(minute)* 60000)+ (Number(second)*1000);
    onChange(timeInMs);
  }, [second, minute]);

  useEffect(() => {
    const prevMinute = Number(defaultValue)/60000;
    const restMS = Number(defaultValue)%60000;
    const prevSeconds = Number(restMS)/1000;
    setMinute(Math.floor(prevMinute));
    setSecond(prevSeconds);
  }, [defaultValue]);
  return (
    <div>
      <label className='pb-3'>{label}</label>
      <div className='flex flex-col sm:flex-row   gap-5 pl-5'>
        <div className='flex items-center gap-2'>
          <input
            className='border-2 border-tints-50 rounded p-1 w-[80px] outline-none text-center '
            placeholder='1'
            type='number'
            min={0}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            onKeyDown={handleInputCheck}
          />
          <h1>Minutes</h1>
        </div>
        <div className='flex items-center gap-2'>
          <input
            className='border-2 border-tints-50 rounded p-1 w-[80px] outline-none text-center '
            placeholder='0'
            type='number'
            min={0}
            max={59}
            value={second}
            onChange={(e) => {
              if (e.target.value < 60) setSecond(e.target.value);
              else toast.error('Second must be between 0 to 59');
            }}
            onKeyDown={handleInputCheck}
          />
          <h1>Seconds</h1>
        </div>
      </div>
    </div>
  );
}
