import React from 'react';
import { ArrowLeftIcon } from '../../assets/svg-icon';

function CreateTitle({ title, className, isCreate = true }) {
  return (
    <div className={`${className} flex space-x-4 cursor-pointer`}>
      <div className='bg-tints-900 rounded flex justify-center items-center px-1' onClick={() => window.history.back()}>
        <ArrowLeftIcon className='h-6 stroke-white ' />
      </div>
      <h1 className='font-NunitoSans text-gray-900 font-bold text-lg'>
        {
          isCreate===true? 'Create new' : 'Update'
        }
        {title}
      </h1>
    </div>
  );
}

export default CreateTitle;
