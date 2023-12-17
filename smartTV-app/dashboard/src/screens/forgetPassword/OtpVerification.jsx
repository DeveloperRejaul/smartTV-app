import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import VerifyOtp from '../../components/OtpInput/OtpInput';
import { baseUrl } from '../../constants/constants';
import Loading from '../../components/Loading';

function NewPassword() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  OTP VERIFICATION`;
  const location = useLocation();
  const navigation = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(null);
  const [isLoading, setIsloading]= useState(false);

  const handleVerify = () => {
    setError(null);
    if (!location?.state.email || !location.state.token) toast.error('Faild to verify otp. Go back and try again');
    else if (otp.join('').length !== 4) setError('Invalid Otp');
    else {
      setIsloading(true);
      fetch(`${baseUrl}user/verify-otp`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          otp: Number(otp.join('')),
          token: location?.state?.token,
        }),
      }).then((data) => data.json()).then((res) => {
        setIsloading(false);
        if (res.status===200) {
          navigation(navPath.newPassword, { state: { otp: Number(otp.join('')), token: res?.data?.token } });
        } else toast.error(res.message);
      });
    }
  };
  if (isLoading) return <Loading />;
  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='shadow-md px-10 py-10 rounded-md max-w-[500px] w-full'>
        <LogoHeader
          title='Otp Verification'
          subtitle='Please enter your otp below'
        />
        <VerifyOtp otp={otp} setOtp={setOtp} />
        <div className=''>
          {error ? (
            <p className='max-w-[280px] pt-2 mx-auto w-full text-red-400'>
              {error}
            </p>
          ) : (
            ''
          )}
        </div>
        <ButtonCom
          text='Verify'
          className='w-full py-1 mt-10'
          onClick={() => handleVerify()}
        />
        <ToastContainer />
      </div>
    </div>
  );
}

export default NewPassword;

