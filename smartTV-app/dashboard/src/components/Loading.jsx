import React from 'react';
import loader from '../assets/loader.png';

function Loading() {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-black-50/20 z-[5000]'>
      {/* <div className={`absolute bg-transparent opacity-10 top-0 left-0 right-0 bottom-0`}></div> */}
      <div className='flex w-full h-full items-center justify-center'>
        <img className='h-36 w-36 clockwise' src={loader} alt='' />
      </div>
    </div>
  );
}

export default Loading;
