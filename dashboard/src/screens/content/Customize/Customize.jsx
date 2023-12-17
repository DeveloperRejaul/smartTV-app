import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/modal/Modal';
import useDimension from '../../../hook/useDimension';
import Image from '../../../components/image/Image';
import { AnalogClock } from '../../../assets';
import TextInput from '../../../components/textInput/TextInput';
import Dropdown from '../../../components/dropdown/Dropdown';
import ButtonCom from '../../../components/button/buttonCom';

function Customize({ modal, setModal }) {
  const { OHeight, OWidth } = useDimension();
  const leftWidth = ((OWidth / 1.5) / 100) * 40;
  const { handleSubmit, register } = useForm();

  const onSubmit = () => {};

  return (
    <Modal
      showModal={modal}
      setShowModal={setModal}
    >
      <div
        style={{ height: OHeight / 1.3, width: OWidth / 1.5 }}
        className='rounded-lg font-NunitoSans text-sm text-gray-900 overflow-hidden pb-20'
      >

        {/* Header part || part 01 */}
        <div className='bg-tints-900 py-2 text-center text-white rounded-t-lg'>Customize </div>

        {/* Body part || part 02 */}
        <div className='flex justify-between py-8 px-4 space-x-8 h-full overflow-y-auto'>
          {/* Left part */}
          <div className='w-[35%] space-y-4'>
            <h1 className='text-lg font-bold'>Analog Clock</h1>
            <div className='bg-gray-200 p-2 rounded-lg px-4 py-5 flex justify-center'>
              <Image src={AnalogClock} w={leftWidth / 2.5} />
            </div>
            <h2 className='text-lg'> This clock design will be seen in your display </h2>
          </div>

          {/* Right part */}
          <div className='flex-1 px-4'>
            <h3 className='text-lg font-bold mb-1'> Settings</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 bg-gray-100 px-2 pt-8 pb-3 rounded-lg'>
              <TextInput label='App Name' register={register('name')} className='bg-white' />
              <Dropdown
                label='Enter Location'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <div className='flex justify-between'>
                <Dropdown
                  className='w-[45%]'
                  label='Time Format'
                  bodyStyle='bg-white'
                  itemStyle='bg-gray-100'
                />
                <Dropdown
                  className='w-[45%]'
                  label='Time Zone'
                  bodyStyle='bg-white'
                  itemStyle='bg-gray-100'
                />
              </div>
              <Dropdown
                label='Time Before Azan Countdown'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Time Before Iqamah Countdown'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Display Time'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Choose content'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Azan Video'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Preparing for Solat Screen'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <Dropdown
                label='Blank Screen Time'
                bodyStyle='bg-white'
                itemStyle='bg-gray-100'
              />
              <div className='flex justify-end space-x-4'>
                <ButtonCom text='Preview' className='w-28 bg-blue-500 hover:bg-blue-600' btnType='button' />
                <ButtonCom text='Save and Publish' className='w-40' btnType='submit' />
              </div>
            </form>
          </div>
        </div>
      </div>

    </Modal>
  );
}

export default Customize;
