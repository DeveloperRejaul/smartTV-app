/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreateNewLay from '../../layout/CreateNew/CreateNewLay';
import TextInput from '../../components/textInput/TextInput';
import { useCreateMasjidUserMutation, useUpdateMasjidUserMutation } from '../../rtk/features/api/user.api';
import { defaultImage } from '../../assets';
import { cleanEmptyObjValue } from '../../utils/utils.fn';
import { baseUrl, userType } from '../../constants/constants';
import { Search } from '../../assets/svg-icon';
import { validation } from '../../utils/Validation';
import Loading from '../../components/Loading';
import { navPath } from '../../constants/navPath';

function UserCreate() {
  const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm();
  const [file, setFile] = useState('');
  const { state } = useLocation();
  document.title=`${import.meta.env.VITE_APP_TITLE} | ${state?'UPDATE': 'CREATE'} MASJID USER`;
  const [btnType, setBtnType] = useState('Save');
  const isUpdate = btnType === 'Update';
  const { userType: user, org } = useSelector((s) => s.user) || {};
  const [createUser, { isLoading: creating, isSuccess: createSuccess }] = useCreateMasjidUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateMasjidUserMutation();
  let typingTimer;
  const [orgList, setOrgList]= useState([]);
  const [active, setActive]=useState(false);
  const [searchVal, setSearchVal]=useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setBtnType('Update');
      setValue('name', state?.name);
      setValue('email', state?.email);
      setValue('userId', state?.id);
      setFile(state?.avatar);
    }
    if (!isUpdate && user === userType.masjidOwner || userType.admin) setValue('masjidId', org);
  }, []);
  const onSubmit = (data) => {
    const { message: email } = validation.isEmail(data.email);
    const { message: pass } = validation.checkPass(data.password);
    const { message: conPass } = validation.checkConfirmPass(data.confirmPassword);
    if (email) {
      setError('email', { type: 'manual', message: email });
      return;
    }
    if (!isUpdate || (data.password!=='' || data.confirmPassword!=='')) {
      if (pass) {
        setError('password', { type: 'manual', message: pass });
        return;
      }
      if (conPass) {
        setError('confirmPassword', { type: 'manual', message: conPass });
        return;
      }
    }

    const fromData = new FormData();
    if (!isUpdate) {
      if (data.masjidId===null || data?.masjidId===undefined) return setError('masjidName', { message: 'Select masjid name' });
      const dataObj = cleanEmptyObjValue({
        name: data?.name,
        email: data?.email,
        password: data?.password,
        org: data?.masjidId,
        userType: userType.user,
      });
      if (file) fromData.append('image', file);
      if (data) fromData.append('data', JSON.stringify(dataObj));
      createUser(fromData);
    }
    if (isUpdate) {
      const dataObj = cleanEmptyObjValue({ name: data?.name, email: data?.email, password: data?.password });
      if (file) fromData.append('image', file);
      if (data) fromData.append('data', JSON.stringify(dataObj));
      updateUser({ id: data.userId, body: fromData });
    }
  };

  const handleSearch = (value) => {
    setSearchVal(value);
    setValue('masjidId', null);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      fetch(`${baseUrl}organization?search=${value}&limit=30`, {
        credentials: 'include',
      }).then((res) => res.json()).then((data) => {
        setOrgList(data.docs);
      });
    }, 500);
  };

  useEffect(() => {
    if (createSuccess) {
      navigate(navPath.user);
    }
  }, [createSuccess]);

  return (
    <div>
      <div className='h-5'>
        {
          (creating || updating)?<Loading />:''
        }
      </div>
      <CreateNewLay
        titleLeft='Profile Image'
        title=' user'
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 py-10'
        selectFile={setFile}
        img={state?.avatar || defaultImage}
        btnText={btnType}
        isLoading={!isUpdate ? creating : updating}
        isCreate={!state}
        clearErrors={clearErrors}
        stateAltImgName={state?.name?.slice(0, 2) || null}

      >
        <TextInput
          placeholder='Full Name'
          label='Name'
          error={errors?.name?.message}
          register={register('name', { required: 'Name is required' })}
          className={` ${errors?.name?.message? 'border-error':''}`}
        />
        <TextInput
          placeholder='Email'
          label='Email'
          error={errors?.email?.message}
          register={register('email', { required: 'Email is required' })}
        />
        <TextInput
          placeholder='Password'
          label='Password'
          type='password'
          register={register('password', { required: isUpdate? false : ' Password is required' })}
          error={errors?.password?.message}
          icon
        />
        <TextInput
          placeholder='Confirm password'
          label='Confirm Password'
          icon
          register={register('confirmPassword', { required: isUpdate? false : 'Confirm password is required' })}
          error={errors?.confirmPassword?.message}
          type='password'
        />
        {/* <TextInput
          placeholder={isUpdate ? 'User ID' : 'Masjid ID'}
          label={isUpdate ? 'User Id ' : 'Masjid ID'}
          register={register(isUpdate ? 'userId' : 'masjidId')}
          disabled={isUpdate}
        /> */}
        {(!isUpdate && user==='supper-admin')? <TextInput value={searchVal} disabled={isUpdate} placeholder='Type masjid name here' label='Masjid Name' onChange={(e) => handleSearch(e.target.value)} onFocus={() => setActive(true)} EndIcon={Search} EndIconStyle='w-[20px] h-[20px] mt-0.5' />:''}
        <div className={`relative ${active===true? 'block': 'hidden'}`}>
          <ul className='absolute top-0 left-0 right-0 bg-white rounded divide-y' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
            {
              orgList.map((l, index) => <li className='cursor-pointer hover:bg-tints-100 p-2 rounded' onClick={() => { setActive(false); setSearchVal(l.name); setValue('masjidId', l._id); }} key={index}>{l.name}</li>)
            }

          </ul>
        </div>
        {errors?.masjidName?.message ? <p className='text-error'>{errors?.masjidName?.message}</p> : ''}
      </CreateNewLay>
    </div>
  );
}

export default UserCreate;
