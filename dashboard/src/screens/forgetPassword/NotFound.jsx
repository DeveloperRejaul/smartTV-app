import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import notFound from '../../assets/notfound.png';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='md:shadow-md lg:shadow-md px-10 py-10 rounded-md space-y-4 flex flex-col'>
        <LogoHeader
          title='We didn’t find any account'
          subtitle='Ensure the email address is valid and associated with an existing account'
        />
        <img src={notFound} alt='not found' className='flex self-center w-[30%]' />
        <ButtonCom
          text='Retry'
          className='w-full py-1'
          onClick={() => navigate(navPath.findMail)}
        />
      </div>
    </div>
  );
}

export default NotFound;
