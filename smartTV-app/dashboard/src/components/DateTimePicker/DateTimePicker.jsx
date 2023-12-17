import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import '../../styles/datepicker.css';

export default function DateTimePicker({ onChange=() => {}, label, defaultValue= new Date(), errors }) {
  const [startDate, setStartDate] = useState(defaultValue);
  useEffect(() => {
    onChange(new Date(startDate).toISOString());
  }, [startDate]);

  return (
    <div className=''>
      {
        label? <p>{label}</p>:''

      }
      <div className='w-full border-2 rounded p-1 border-tints-50 cursor-pointer '>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeFormat='HH:mm'
          dateFormat='MMMM d, yyyy h:mm aa'
        />
      </div>
      {
        errors? <p className='text-error'>{errors}</p>:''
      }

    </div>
  );
}
