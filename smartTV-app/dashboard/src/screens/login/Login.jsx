import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonCom from '../../components/button/buttonCom';
import Link from '../../components/link/Link';
import TextInput from '../../components/textInput/TextInput';
import { navPath } from '../../constants/navPath';
import { LoginBg } from '../../assets';
import LogoHeader from '../../components/logoHeader/LogoHeader';
import { validation } from '../../utils/Validation';
import { useLoginMutation } from '../../rtk/features/api/auth.api';

export default function Login() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  LOGIN`;

  const { handleSubmit, register, setError, formState: { errors } } = useForm();
  const [handleLogin, { isSuccess, isLoading }] = useLoginMutation();
  const navigation = useNavigate();

  const onSubmit = (data) => {
    const { message: email } = validation.isEmail(data.email);
    const { message: pass } = validation.checkPass(data.password);
    if (email) setError('email', { type: 'manual', message: email });
    if (pass) setError('password', { type: 'manual', message: pass });
    handleLogin({ email: data.email, password: data.password });
  };

  useEffect(() => {
    isSuccess && navigation(navPath.dashboard);
  }, [isSuccess]);

  return (
    <div className='h-screen grid grid-cols-12 bg-wight-900'>

      {/* Left Part start */}
      <div className='flex flex-1 justify-center items-center xl:col-span-6 md:col-span-7 col-span-12'>
        <section className='w-[80%] sm:w-[60%]'>
          <LogoHeader
            title='Login to your Account'
            subtitle='See what is going on with your business'
          />
          {/* From */}
          <form
            className='space-y-2 md:space-y-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              register={{ ...register('email', { required: true }) }}
              label='Email'
              placeholder='mail@abcd.com'
              error={errors?.email?.message}
            />
            <div>
              <TextInput
                register={{ ...register('password', { required: true }) }}
                label='Password'
                icon
                type='password'
                error={errors?.password?.message}
              />
              <Link
                text='Forget password ?'
                path={navPath.findMail}
                className='justify-end'
              />
            </div>
            <ButtonCom
              text='Login'
              className='w-full py-1 flex'
              loading={isLoading}
              onClick={() => { }}
            />
          </form>
          {/* <div className='flex'>
            <Link
              text=' Create an account'
              normalText='Not register yet ? '
              className='justify-end mt-2'
              path={navPath.signUp}
            />
          </div> */}
        </section>
      </div>

      {/* Right part start */}
      <div className='hidden md:block xl:col-span-6 md:col-span-5'>
        <div className='flex flex-1 h-screen justify-center items-end relative'>
          <img
            src={LoginBg}
            className='object-cover w-full h-full'
            alt='Login-bg'
          />
          <div className='absolute top-[40%] w-3/4 bg-[#0000008e] text-center py-7 px-5 rounded-lg'>
            <h1 className='text-wight-900 text-4xl font-NunitoSans font-bold drop-shadow-xl'>
              Selamat datang ke Taqwim TV
            </h1>
            <h3 className=' text-[#FFFFFF] text-lg font-NunitoSans  drop-shadow-md font-[600] max-w-[450px] mx-auto'>
              Sistem Paparan Digital lslamic Berpusat untuk Masjid, Surau dan Premis Perniagaan
            </h3>
            <h3 className=' text-[#FFFFFF] text-sm font-NunitoSans font-normal drop-shadow-md max-w-[450px] mx-auto'>
              Islamic Digital Signage Solutions for Masjid, Surau and Businesses with Remote Content Management
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
