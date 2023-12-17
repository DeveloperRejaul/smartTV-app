/**
 * Input Field Component.
 *
 * @component
 * @param {boolean} arg.labelColor - It will set the label color as blue.  if we use If we dont use it , color will be default. value can be true or false.
 * @param {boolean}  arg.blue - It will set the border color as blue.  value can be true or false.
 * @param {string}  arg.className - It is used to add custom tailwind classes.
 * @param {string}  arg.label - The label text for the input.
 * @param {string}  arg.name - The name attribute for the input.
 * @param {string} value - The current value of the input.
 * @param {function}  arg.onChange - A callback function to handle input value changes.
 * @param {function}  arg.setValue - A callback function to set value in hookform.
 * @param {string}  arg.placeholder - The placeholder text for the input.
 * @param {string}  arg.errors - An error message to display if there's an input validation error.
 *
 * @returns {JSX.Element} The rendered Input field.
 * I.E: <DateRangePicker setValue={setValue}  name='range' errors={errors['range']} placeholder='Select Date Range' onChange={(val)=>console.log('range:',val)} />
        <DateRangePicker setValue={setValue}  name='range2' value={['2023-9-15', '2023-9-23']} errors={errors['range2']} placeholder='Select Date Range' onChange={(val)=>console.log('range2:',val)} />
 */

import { useEffect, useRef, useState } from 'react';
import {
  DownArrow,
  Error,
  ArrowLeft02,
  ArrowRight02,
} from '../../assets/svg-icon';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DateRangePicker({
  onChange = () => {},
  setValue = () => {},
  value,
  name = 'date',
  errors,
  placeholder = 'Select Date',
  className = '',
  label,
  labelColor = false,
}) {
  const [isOpen, setIsopen] = useState(false);
  const [startDate, setStartdate] = useState(null);
  const [endDate, setEnddate] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const daysInMonth = () =>
    new Date(currentYear, currentMonth + 1, 0).getDate();
  const [daysArray, setDaysarray] = useState([...Array(daysInMonth()).keys()]);
  const [blankDays, setBlackdays] = useState(
    new Date(currentYear, currentMonth, 1).getDay(),
  );
  const [selectedText, setSelectedtext] = useState('');
  const modalRef = useRef(null);
  const monthHandler = (val) => {
    if (val === 'next')
      currentMonth < 11
        ? setCurrentMonth((prev) => prev + 1)
        : (setCurrentMonth(0), setCurrentYear((prev) => prev + 1));
    else
      currentMonth > 0
        ? setCurrentMonth((prev) => prev - 1)
        : (setCurrentMonth(11), setCurrentYear((prev) => prev - 1));
  };

  useEffect(() => {
    setDaysarray([...Array(daysInMonth()).keys()]);
    setBlackdays(new Date(currentYear, currentMonth, 1).getDay());
  }, [currentYear, currentMonth]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsopen(false);
      }
    };
    isOpen
      ? document.addEventListener('mousedown', handleOutsideClick)
      : document.removeEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    onChange([
      startDate
        ? `${startDate?.year}-${startDate?.month + 1}-${startDate?.date}`
        : '',
      endDate ? `${endDate?.year}-${endDate?.month + 1}-${endDate?.date}` : '',
    ]);
    setValue(name, [
      startDate
        ? `${startDate?.year}-${startDate?.month + 1}-${startDate?.date}`
        : '',
      endDate ? `${endDate?.year}-${endDate?.month + 1}-${endDate?.date}` : '',
    ]);
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      setSelectedtext(
        `${new Date(value[0]).toLocaleDateString()} to ${new Date(
          value[1],
        ).toLocaleDateString()}`,
      );
      setValue(name, value);
      onChange(value);
      if (value.length === 2) {
        const start = value[0].split('-');
        const end = value[1].split('-');
        setStartdate({
          year: Number(start[0]),
          month: Number(start[1]) - 1,
          date: Number(start[2]),
        });
        setEnddate({
          year: Number(end[0]),
          month: Number(end[1]) - 1,
          date: Number(end[2]),
        });
        setCurrentYear(start[0]);
        setCurrentMonth(start[1] - 1);
      }
    } else {
      setValue(name, ['', '']);
      onChange(['', '']);
    }
  }, []);

  const selectHandler = (date, month, year) => {
    if (startDate) {
      if (
        (date < startDate?.date &&
          month <= startDate?.month &&
          year <= startDate?.year) ||
        (month < startDate?.month && year <= startDate?.year)
      ) {
        setEnddate(startDate);
        setStartdate({ date, month, year });

        return;
      }
      setEnddate({ date, month, year });
    } else setStartdate({ date, month, year });
  };

  const checkRange = (day) => {
    if (
      day > startDate?.date &&
      day < endDate?.date &&
      currentMonth === startDate?.month &&
      currentMonth === endDate?.month &&
      currentYear >= startDate?.year &&
      currentYear <= endDate?.year
    )
      return true;
    if (
      currentMonth > startDate?.month &&
      currentMonth < endDate?.month &&
      currentYear >= startDate?.year &&
      currentYear <= endDate?.year
    )
      return true;
    if (
      day > startDate?.date &&
      currentMonth < endDate?.month &&
      currentMonth >= startDate?.month &&
      currentYear >= startDate?.year &&
      currentYear <= endDate?.year
    )
      return true;
    if (
      day < endDate?.date &&
      currentMonth > startDate?.month &&
      currentMonth <= endDate?.month &&
      currentYear >= startDate?.year &&
      currentYear <= endDate?.year
    )
      return true;
    return false;
  };
  useEffect(() => {
    if (endDate !== null) {
      setSelectedtext(
        `${new Date(
          `${startDate?.year}-${startDate?.month + 1}-${startDate?.date}`,
        ).toLocaleDateString()} to ${new Date(
          `${endDate?.year}-${endDate?.month + 1}-${endDate?.date}`,
        ).toLocaleDateString()}`,
      );
    }
  }, [endDate]);

  return (
    <>
      {label ? (
        <p
          className={`pb-2 font-normal text-sm ${
            labelColor ? 'text-blue' : ''
          } `}>
          {label}
        </p>
      ) : (
        ''
      )}
      <div className='relative'>
        <div
          className={`cursor-pointer h-[2.25rem] border-2 rounded  w-full relative ${
            errors ? 'border-red-400' : ' border-tints-50 '
          } ${className} `}
          onClick={() => setIsopen(!isOpen)}>
          <div className='flex w-full items-center justify-between h-full px-[0.75rem]'>
            <span className='text-[0.875rem] leading-[1.25rem] font-[400] text-graish '>
              {selectedText !== '' ? selectedText : value || placeholder}
            </span>
            <div className='w-[1.375rem] h-3.5 bg-zinc-200 rounded-sm'>
              <DownArrow />
            </div>
          </div>
        </div>
        {isOpen ? (
          <div
            className=' bg-white rounded-[0.5rem] p-[1.25rem] h-[18rem]  max-w-[20rem] w-full shadow-lg absolute top-9 z-[50] '
            ref={modalRef}>
            <div className='flex items-center justify-between'>
              <ArrowLeft02
                className='h-[1.2rem] w-[1.2rem] cursor-pointer'
                onClick={() => monthHandler('prev')}
              />
              <span className='text-[0.875rem] leading-[1.25rem] font-[400]'>
                {`${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                  new Date(currentYear, currentMonth, 1),
                )} ${currentYear}`}
              </span>
              <ArrowRight02
                className='h-[1.2rem] w-[1.2rem] cursor-pointer'
                onClick={() => monthHandler('next')}
              />
            </div>
            <div className='grid grid-cols-7 w-full pt-[0.625rem]'>
              {days.map((day, i) => (
                <span
                  className='text-[0.75rem] leading-[1rem] font-[400] pl-2.5'
                  key={Math.random()}>
                  {day}
                </span>
              ))}
            </div>
            <div className='grid grid-cols-7 w-full pt-[0.625rem]'>
              {[...Array(blankDays).keys()].map((blankDay, i) => (
                <span
                  className='text-[0.75rem] leading-[1rem] font-[400] p-2'
                  key={Math.random()}
                />
              ))}
              {daysArray.map((day, i) => (
                <span
                  className={`text-[0.75rem] leading-[1rem] font-[400] p-2 cursor-pointer  text-center  mb-1 ${
                    startDate?.year == currentYear &&
                    startDate?.month == currentMonth &&
                    startDate?.date == i + 1
                      ? 'bg-tints-900 text-white rounded-l-full'
                      : ''
                  } ${
                    endDate?.year == currentYear &&
                    endDate?.month == currentMonth &&
                    endDate?.date == i + 1
                      ? 'bg-tints-900 text-white rounded-r-full'
                      : ''
                  } ${checkRange(i + 1) ? 'bg-tints-200  ' : ''}`}
                  key={i}
                  onClick={() =>
                    selectHandler(i + 1, currentMonth, currentYear)
                  }>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
      {errors && (
        <p className='text-red text-sm font-normal leading-tight flex items-center gap-2 pt-1'>
          <Error />
          {errors.message}
        </p>
      )}
    </>
  );
}

