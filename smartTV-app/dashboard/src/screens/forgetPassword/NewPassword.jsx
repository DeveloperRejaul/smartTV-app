import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import TextInput from '../../components/textInput/TextInput';
import ButtonCom from '../../components/button/buttonCom';
import { validation } from '../../utils/Validation';
import { useResetPasswordMutation } from '../../rtk/features/api/auth.api';
import { navPath } from '../../constants/navPath';
import Loading from '../../components/Loading';

function NewPassword() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  RESET PASSWORD`;
  const { setError, handleSubmit, formState: { errors }, register } = useForm();
  const [setPassword, { isSuccess, isError, isLoading }] = useResetPasswordMutation();
  const location = useLocation();
  const navigation = useNavigate();

  const onSubmit = (data) => {
    const { message: pass } = validation.checkPass(data.password);
    const { message: cPass } = validation.checkConfirmPass(data.confirmPassword);
    if (pass)setError('password', { type: 'manual', message: pass });
    if (cPass) setError('confirmPassword', { type: 'manual', message: cPass });
    const errorExist = pass || cPass;
    if (!errorExist) setPassword({ otp: location.state.otp, token: location.state.token, password: data.password });
  };
  useEffect(() => {
    if (isError) toast('Something went wrong', { position: toast.POSITION.TOP_RIGHT });
    if (isSuccess) {
      toast.success('Password successfullly changed');
      navigation(navPath.login);
    }
  }, [navigation, isError, isSuccess]);

  if (isLoading) return <Loading />;

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='shadow-md px-10 py-10 rounded-md'>
        <LogoHeader
          title='Create your new password'
          subtitle='Please enter a new password below'
        />
        <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            icon
            label='Create new password'
            register={{ ...register('password', { required: true }) }}
            error={errors?.password?.message}
          />
          <TextInput
            icon
            label='Confirm password'
            register={{ ...register('confirmPassword', { required: true }) }}
            error={errors?.confirmPassword?.message}
          />
          <ButtonCom text='Confirm' className='w-full py-1' onClick={() => {}} />
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default NewPassword;
