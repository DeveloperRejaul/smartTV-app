import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import TextInput from '../../components/textInput/TextInput';
import ButtonCom from '../../components/button/buttonCom';
import { validation } from '../../utils/Validation';
import { useSupersignupMutation } from '../../rtk/features/api/auth.api';
import { navPath } from '../../constants/navPath';
import { Edit, ImageAdd } from '../../assets/svg-icon';
import Loading from '../../components/Loading';

function SignUp() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [supersignup, { error, isSuccess, isLoading }] = useSupersignupMutation();
  const [file, setFile] = useState('');
  const [fileUri, setFileUri] = useState('');
  const navigation = useNavigate();

  const handleChoiceFile = () => document.getElementById('fileInput').onclick();
  const handleFileChange = (event) => {
    const profile = event.target.files[0];
    if (profile) {
      setFile(profile);
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = () => {
        setFileUri(reader.result);
      };
    }
  };

  const onSubmit = (data) => {
    const { message: email } = validation.isEmail(data.email);
    const { message: pass } = validation.checkPass(data.password);
    const { message: conPass } = validation.checkConfirmPass(data.confirmPassword);
    if (email) setError('email', { type: 'manual', message: email });
    if (pass) setError('password', { type: 'manual', message: pass });
    if (conPass) setError('confirmPassword', { type: 'manual', message: conPass });
    const errorExist = email || pass || conPass;

    const body = {
      email: data.email,
      password: data.password,
      name: data.name,
      address: data.address,
      userType: 'supper-admin',
    };
    const jsonString = JSON.stringify(body);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', jsonString);
    if (!errorExist)supersignup(formData);
  };

  useEffect(() => {
    if (error) toast.error(error.data, { position: toast.POSITION.TOP_RIGHT });
    if (isSuccess) {
      toast.success('Signup successfull');
      navigation(navPath.login);
    }
  }, [error, isSuccess, navigation]);

  if (isLoading) return <Loading />;

  return (
    <div className='flex flex-1  bg-wight-900 justify-center items-center'>
      <div className=' w-[90%] md:w-[50%] lg:w-[40%] my-10'>
        {/* Header part Start */}
        <section className='flex justify-center flex-col items-center'>
          <LogoHeader
            title='Create an Account'
            subtitle='Start your journey with Masjid by creating a free account'
          />

          <div className='flex flex-col items-center'>
            <label
              className='w-20 h-20 bg-grays-100 rounded-xl flex justify-center items-center overflow-hidden cursor-pointer'
              onClick={handleChoiceFile}
              htmlFor='fileInput'
            >
              {fileUri ? (
                <img
                  className='object-cover h-full w-full'
                  src={fileUri}
                  alt='profile'
                />
              ) : (
                <ImageAdd className='text-4xl text-gray-700' />
              )}
            </label>
            <input
              type='file'
              name='choice photo'
              id='fileInput'
              className='hidden'
              onChange={handleFileChange}
            />
            {file ? (
              <div className='flex justify-between ma'>
                <p className='text-gray-500 text-[.6rem]'>Profile Photo</p>
                <Edit className='text-tints-900 cursor-pointer' />
              </div>
            ) : (
              <h1 className='text-gray-500 text-[.5rem]'>
                Upload Profile Photo
              </h1>
            )}
          </div>
        </section>
        <ToastContainer />
        {/* body part start */}
        <section>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label='Name'
              placeholder='Abul Kalam'
              register={register('name', { required: true })}
              error={errors?.name?.message}
            />
            <TextInput
              label='Email'
              placeholder='mail@acb.com'
              register={register('email', { required: true })}
              error={errors?.email?.message}
            />
            <TextInput
              label='Password'
              icon
              register={register('password', { required: true })}
              error={errors?.password?.message}
              type='password'
            />
            <TextInput
              label='Confirm Password'
              icon
              register={register('confirmPassword', { required: true })}
              error={errors?.confirmPassword?.message}
              type='password'
            />
            <TextInput
              label='Address'
              register={register('address', { required: true })}
              error={errors?.address?.message}
            />
            <ButtonCom
              text='Confirm'
              className='w-full  '
              onClick={() => {}}
            />
          </form>
        </section>
      </div>
    </div>
  );
}

export default SignUp;
