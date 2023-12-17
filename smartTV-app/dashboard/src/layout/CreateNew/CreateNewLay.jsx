import React from 'react';
import ButtonCom from '../../components/button/buttonCom';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import CreateTitle from '../../components/createTitle/CreateTitle';
import { baseUrl } from '../../constants/constants';

/**
 * @param children jsx
 * @param title string data type
 * @param className string data type
 * @param onSave callback Function
 * @param onCancel callback Function
 * @param titleLeft string data type
 * @param isLoading boolean data type
 * @returns jsx
 */
function CreateNewLay({
  children, title, className, onSubmit, selectFile, titleLeft, img, btnText, isLoading, headerHide, clearErrors=() => {}, isCreate = true, orgName='', stateAltImgName = null}) {
  const trackUrl = img?.includes('upload');

  return (
    <div className='flex  flex-col p-6 space-y-16'>
      <CreateTitle isCreate={isCreate} title={title} />
      <div className='flex flex-1 justify-center items-center font-NunitoSans'>
        <div className='w-[95%] xl:w-[70%] px-[8%] py-[5%] flex flex-col bg-white mb-10 rounded shadow-md'>
          {/* card header */}
          {headerHide || (
            <div className='flex flex-col xl:flex-row gap-10 flex-1 xl:items-start '>
              <div className='text-gray-800 font-semibold'>
                {titleLeft?.split(' ')[0]}
                &nbsp;
                {titleLeft?.split(' ')[1]}
              </div>
              <div className='flex flex-col xl:flex-row items-center gap-10'>
                <ImagePicker setFile={selectFile} defaultImage={trackUrl ? baseUrl + img : img} orgName={orgName} stateAltImgName={stateAltImgName} />

                <ul className='space-y-1'>
                  <li className='flex items-center space-x-2 '>
                    <div className='bg-gray-400 rounded-full w-2 h-2' />
                    <span className='text-gray-400 text-sm'>The image must be clear and recent</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='bg-gray-400 rounded-full w-2 h-2' />
                    <span className='text-gray-400 text-sm'>Size must be 4*4</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='bg-gray-400 rounded-full w-2 h-2' />
                    <span className='text-gray-400 text-sm'>Size must not exceed 5mb</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* card body */}
          <form className={className} onSubmit={onSubmit}>
            {children}
            <div className='space-x-2 w-full flex justify-center pt-10'>
              <ButtonCom className='py-[5px] text-lg' text='Cancel' borderOutline btnType='button' onClick={() => window.history.back()} />
              <ButtonCom className='py-[5px] text-lg' text={btnText} onClick={() => clearErrors()} btnType='submit' loading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNewLay;
