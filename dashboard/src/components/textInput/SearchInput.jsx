import React from 'react';
import { Search } from '../../assets/svg-icon';

/**
 * @returns jsx
 */
function SearchInput({ onSearch, className }) {
  return (
    <div className={`${className} border-2 rounded-md py-1 flex border-grays-50 max-w-60 w-full`}>
      <Search className=' text-gray-500 p-1 cursor-pointer w-[25%]' />
      <input
        className='outline-none font-NunitoSans p-1 text-md text-grays-700 placeholder:text-grays-700 w-[80%]'
        placeholder='Search'
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
