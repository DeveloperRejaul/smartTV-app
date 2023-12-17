import React from 'react';
import { ArrowLeft, ArrowRight } from '../../assets/svg-icon';

/**
 * @param {*} handleNext callback function
 * @param {*} handlePrevious callback function
 * @param {*} totalItems string data type , total data length
 * @param {*} item string data type, total showed data length
 * @returns jsx
 */
function TableFooter({ handleNext, handlePrevious, totalItems, item, page }) {
  return (
    <div className='h-10 w-full border-t-2 rounded flex justify-between items-center py-7 mt-0 px-5 bg-white'>
      <span className='text-md text-gray-500 font-NunitoSans'>
        { `Showing ${(page===1 && item===0)?'0': ((page===1 && item>0)? '1': ((page-1)*10)+1)} - ${page===1? item: ((page-1)*10)+item} of ${totalItems || '00'} results`}
      </span>
      <div className='flex cursor-pointer'>
        <ArrowLeft className='w-10 p-2.5 h-10 border-y-2 border-l-2 rounded-s-sm active:scale-95 hover:bg-tints-200' onClick={() => handlePrevious()} />
        <ArrowRight className='w-10 p-2.5 h-10 border-y-2 border-x-2 rounded-s-sm  active:scale-95 hover:bg-tints-200' onClick={() => handleNext()} />
      </div>
    </div>
  );
}

export default TableFooter;
