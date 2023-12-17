import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonCom from '../../../components/button/buttonCom';
import { navPath } from '../../../constants/navPath';
import ClockSelect from './ClockSelect';

function ContentBtn() {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='flex space-x-4'>

      <ButtonCom
        text='Campaign List'
        className='w-48 flex justify-evenly items-center py-4 bg-white border-2 border-tints-900 stroke-tints-900 hover:stroke-white'
        btnClass='h-5'
        leftIconMenu
        borderOutline
        onClick={() => { }}
        path={navPath.campaignList}
      />

      <div>
        <ButtonCom
          text='Create New'
          className='w-48 flex justify-evenly items-center py-4 border-2 border-tints-900'
          icon
          btnClass='h-5'
          iconRight
          onClick={() => setShow((pre) => !pre)}
        />

        {/* Clock select modal hare */}
        <ClockSelect modal={modal} setModal={setModal} />

        {show && (
          <div className='grid gap-y-1 mt-5 shadow-md rounded-b-md '>
            <div onClick={() => navigate(navPath.createCampaign)} className='bg-tints-900 px-3 text-white py-1 cursor-pointer'> New Campaign </div>
            <div className='px-3 text-gray-900 hover:bg-gray-100 py-1 cursor-pointer' onClick={() => setModal(true)}> Customize App </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentBtn;
