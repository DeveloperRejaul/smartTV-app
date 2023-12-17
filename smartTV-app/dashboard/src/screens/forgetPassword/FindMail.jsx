import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import TextInput from '../../components/textInput/TextInput';
import ButtonCom from '../../components/button/buttonCom';
import { validation } from '../../utils/Validation';
import { navPath } from '../../constants/navPath';
import { useMailCheckExistsMutation } from '../../rtk/features/api/auth.api';
import Loading from '../../components/Loading';

function FindMail() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  FORGOT PASSWORD`;
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [mailExists, { isSuccess, isError, data: res, isLoading }] = useMailCheckExistsMutation();
  const navigation = useNavigate();

  const onSubmit = (data) => {
    const { message } = validation.isEmail(data.email);
    if (message) setError('email', { type: 'manual', message });
    if (!message) mailExists({ email: data.email });
  };

  useEffect(() => {
    if (isError) navigation(navPath.notFound);
    if (isSuccess) {
      toast.success('We sent you an otp on your email');
      navigation(navPath.verifyOtp, { state: res });
    }
  }, [isError, isSuccess, navigation, res]);

  if (isLoading) return <Loading />;

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='md:shadow-md lg:shadow-md px-10 py-10 rounded-md space-y-4'>
        <LogoHeader
          title='Enter your email address'
          subtitle='Ensure the email address is valid and associated with an existing account'
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label='Email'
            placeholder='mail@acd.com'
            register={{ ...register('email', { required: true }) }}
            error={errors?.email?.message}
          />
          <ButtonCom
            text='Confirm'
            className='w-full py-1 mt-3'
            btnType='submit'
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
}

export default FindMail;
