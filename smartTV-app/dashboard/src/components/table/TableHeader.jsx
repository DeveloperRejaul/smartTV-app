import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Down, Transfer } from '../../assets/svg-icon';
import SearchInput from '../textInput/SearchInput';

function TableHeader({ onSort, icon, onSearch, hideSort=false }) {
  const { pathname }= useLocation();
  const { userType } = useSelector((state) => state.user);
  return (
    <div className=' w-full py-2'>
      <div className='flex flex-col sm:flex-row justify-between w-full'>
        <div className={`flex items-center bg-tints-900 w-10 justify-center text-white rounded px-6 mb-5 sm:mb-0 py-2 cursor-pointer ${pathname==='/content' && userType!=='supper-admin'? 'hidden': 'block'}`}>
          <p>All</p>
          {icon && <Down className='w-5 fill-white' />}
        </div>
        <div />
        <div className='flex justify-end  '>
          <div className='flex gap-3'>
            <SearchInput onSearch={onSearch} />
            {
              hideSort===false
                ?(
                  <div className='border-2 px-1 flex items-center rounded cursor-pointer' onClick={() => onSort()}>
                    <Transfer className='h-4 text-grays-500 w-10' />
                  </div>
                )
                :''
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableHeader;
