import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../constants/constants';
import { stringFirstUp } from '../../utils/stringOpration';
import burgerMenu from '../../assets/burgerMenu.svg';
import SideBar from '../sidebar/SideBar';

/**
 * @returns  Header component
 */
export default function HeaderCom() {
  const { avatar, name, userType } = useSelector((state) => state.user);
  const [first, last] = userType?.split('-') || '-';
  const lastName = last ?? '';
  const [imageError, setImageError]= useState(false);
  const [isOpen, setIsOpen]= useState(false);
  const modalRef = useRef();

  useEffect(() => {
    fetch(baseUrl+ avatar).then((res) => {
      res.status===200?setImageError(false): setImageError(true);
    });
  }, [avatar]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    isOpen ? document.addEventListener('mousedown', handleOutsideClick) : document.removeEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className='relative'>
      <div className=' h-14  px-5 items-center flex justify-center w-full shadow-header border-b-2'>
        <div><img className='w-[25px] h-[25px] md:hidden' src={burgerMenu} alt='Menu' onClick={() => setIsOpen((prev) => !prev)} /></div>
        <div className=' flex items-center space-x-6 self-center ml-auto px-5'>
          <div className='w-10 h-10 rounded-full  flex justify-center items-center text-wight-900 relative'>
            <div className='absolute w-3 h-3 bg-wight-900 rounded-full flex justify-center items-center right-0 top-0'>
              <div className='h-2 w-2 bg-green-500 rounded-full' />
            </div>
            {imageError?(
              <div className='w-10 h-10 rounded-full font-[600] bg-slate-300 flex justify-center items-center text-tints-700 uppercase'>
                {name.slice(0, 2)}
              </div>
            )
              :(
                <img
                  src={baseUrl + avatar}
                  alt='OE'
                  className='w-10 h-10 rounded-full'
                />
              )}
          </div>
          <div className='-space-y-1'>
            <h1 className='text-lg font-semibold font-NunitoSans'>{stringFirstUp(name)}</h1>
            <h1 className='text-xs text-tints-900'>
              {`${stringFirstUp(first)} ${stringFirstUp(lastName)}`}
            </h1>
          </div>
        </div>
      </div>
      <div className={`w-3/5 absolute top-0 duration-300 md:hidden ${isOpen?'left-0':'-left-[1000px]'} z-20`} ref={modalRef}>
        <SideBar />
      </div>
      <div className={`bg-[#000000]/30 absolute top-0 left-0 h-screen w-screen z-10 ${isOpen?'block':'hidden'} duration-300 md:hidden`} />
    </div>
  );
}
