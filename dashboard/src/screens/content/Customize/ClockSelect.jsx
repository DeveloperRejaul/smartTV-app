import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/modal/Modal';
import useDimension from '../../../hook/useDimension';
import SearchInput from '../../../components/textInput/SearchInput';
import { Clock, Transfer } from '../../../assets/svg-icon';
import { AnalogClock } from '../../../assets';
import Image from '../../../components/image/Image';
import ButtonCom from '../../../components/button/buttonCom';
import Customize from './Customize';

function ClockSelect({ modal, setModal }) {
  const [modal2, setModal2] = useState('');
  const { OHeight, OWidth } = useDimension();
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    setModal(false);
    setModal2(true);
  };

  return (
    <>
      <Customize modal={modal2} setModal={setModal2} />
      <Modal
        showModal={modal}
        setShowModal={setModal}
      >
        {/* Modal body */}
        <div className=' font-NunitoSans' style={{ height: OHeight / 1.3, width: OWidth / 1.5 }}>

          {/* Header part  || part 01 */}
          <div className='flex border-b-2 w-full h-[10%]'>
            <div className='border-r-2 w-[25%] py-2 px-2 flex space-x-2 items-center '>
              <SearchInput className='h-7 items-center' />
              <div className='border-2 h-7 w-7 px-1 flex items-center rounded cursor-pointer'>
                <Transfer className='h-4 text-grays-500' />
              </div>
            </div>
            <div className='py-2 flex flex-1 space-x-2 justify-center items-center'>
              <Clock className='stroke-tints-900' />
              <h1 className='text-tints-900'> Clock </h1>
            </div>
          </div>

          {/* body part || part 02 */}
          <div className='flex w-full h-[90%]'>
            {/* Side bar */}
            <div className='border-r-2 w-[25%]'>
              <div className='bg-tints-900 flex space-x-2 py-1 my-2 px-2 items-center cursor-pointer'>
                <Clock className='stroke-white' />
                <h1 className='text-wight-900'> Clock </h1>
              </div>
            </div>
            {/* Body */}
            <form className='flex flex-col flex-1 p-5 h-full' onSubmit={handleSubmit(onSubmit)}>
              {/* Clocks Body */}
              <div className='flex flex-1 justify-between'>
                <ClockItem text='Analog Clock' id='analogClock' register={register('clock')} value='analogClock' />
                <ClockItem text='Digital Clock' id='digitalClock' register={register('clock')} value='digitalClock' />
                <ClockItem text='Count down' id='countdown' register={register('clock')} value='countdown' />
              </div>
              <ButtonCom text='Next' className='self-end' btnType='submit' onClick={() => {}} />
            </form>
          </div>
        </div>

      </Modal>

    </>
  );
}

export default ClockSelect;

// Common Element
function ClockItem({ text, register, id, value }) {
  return (
    <div className='flex flex-col items-center space-y-2'>
      <p className='text-gray-700'>{text}</p>
      <div className='bg-gray-200 p-2 rounded-lg px-4 relative cursor-pointer'>
        <input
          {...register}
          type='radio'
          id={id}
          className='absolute h-5 w-5 border-0 right-2 cursor-pointer'
          value={value}
        />
        <label className='cursor-pointer' htmlFor={id}><Image src={AnalogClock} /></label>
      </div>
    </div>
  );
}
