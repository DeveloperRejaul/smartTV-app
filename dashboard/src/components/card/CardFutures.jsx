import React from 'react';
import CircularProgress from '../circularProgressbar/CircularProgressbar';

/**
 *
 * @param name string data type
 * @param number string data type
 * @param text1 string data type
 * @param text2 string data type
 * @param text3 string data type
 * @param btnText string data type
 * @param onClick callBack function
 * @param percentage1 number data type
 * @param percentage2 number data type
 * @param percentage3 number data type
 * @param bgColor string data type
 * @param stockColor string data type
 * @param borderColor string data type
 * @returns jsx card component
 */

function CardFutures({
  name, number, text1, text2, btnText, onClick,
  percentage1, percentage2, percentage3, bgColor, stockColor,
  borderColor, text3,
}) {
  return (
    <div className='w-full h-[250px] rounded-md p-5 flex flex-col justify-between bg-tints-900' style={{ backgroundColor: bgColor }}>
      <div className='flex h-full justify-start items-start'>
        <div className='w-2/5 flex h-full relative justify-center items-center -mt-4 pr-3  '>
          <CircularProgress percentage={percentage1} h='6rem' w='6rem' strokeWidth={8} stockColor={stockColor} />
          <CircularProgress percentage={percentage2} h='4rem' w='4rem' strokeWidth={12} stockColor={stockColor} />
          <CircularProgress percentage={percentage3} h='2rem' w='2rem' strokeWidth={18} stockColor={stockColor} />
        </div>
        <div className='w-3/5 text-white font-NunitoSans font-bold pt-8'>
          <p className='text-2xl'>{number}</p>
          <p className='font-normal text-sm'>Total</p>
          <p className='font-normal text-lg'>{name}</p>
        </div>
      </div>
      <div className='flex text-white justify-between text-sm space-x-1 '>
        <p className='pr-2'>{text1}</p>
        <div className='border-r-2' style={{ borderRightColor: borderColor }} />
        <p className='px-2'>{text2}</p>
        <div className='border-r-2' style={{ borderRightColor: borderColor }} />
        <p className='px-2'>{text3}</p>
        <div onClick={onClick} className='bg-wight-900  p-1 px-2 rounded font-semibold cursor-pointer' style={{ color: bgColor }}>
          {btnText}
        </div>
      </div>
    </div>
  );
}

export default CardFutures;
