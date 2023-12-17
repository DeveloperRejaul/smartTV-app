import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import userDp from '../../assets/userdp.png';
import Welcome from '../../components/welcome/Welcome';
import TextInput from '../../components/textInput/TextInput';
import ButtonCom from '../../components/button/buttonCom';
import { baseUrl } from '../../constants/constants';
import { cleanEmptyObjValue } from '../../utils/utils.fn';
import { useDeleteUserMutation, useUpdateUserMutation } from '../../rtk/features/api/user.api';
import Security from './Security';
import Title from './Title';
import { logout } from '../../rtk/features/auth/authSlice';
import { navPath } from '../../constants/navPath';
import DeleteModal from '../../components/modal/DeleteModal';

function Setting() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  SETTINGS`;

  const [isGenEdit, setIsGenEdit] = useState(false);
  const { handleSubmit, register, setValue } = useForm();
  const { name, email, avatar, id } = useSelector((state) => state.user) || {};
  const [file, setFile] = useState('');
  const [updateUser, { isLoading, isError, isSuccess }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting, isSuccess: deleted }] = useDeleteUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    setValue('name', name);
    setValue('email', email);
  }, []);

  useEffect(() => {
    if (isError)toast.error(`${'Something wrong'}`, { position: toast.POSITION.TOP_LEFT });
    if (isSuccess) toast.success(`${'Profile successfully updated'}`, { position: toast.POSITION.TOP_LEFT });
    if (deleted) { dispatch(logout()); navigate(navPath.login); }
  }, [isError, isSuccess, deleted]);

  const genHandle = (data) => {
    const fromData = new FormData();
    const objData = cleanEmptyObjValue(data);
    if (file) fromData.append('image', file);
    if (objData) fromData.append('data', JSON.stringify(objData));
    updateUser({ id, body: fromData });
  };

  const handleDelete = () => { deleteUser(id); };

  useEffect(() => {
    if (file && typeof file!=='string') {
      setIsGenEdit(true);
    }
  }, [file]);

  return (
    <div className='p-5'>
      {
        isOpen? <DeleteModal message='Do you really want to delete your account? This process can not be undone.' setIsOpen={setIsOpen} callBack={handleDelete} /> :''
      }
      <Welcome />

      <div className='flex flex-col items-center w-full'>
        <div className='bg-white md:w-[70%] w-[90%] rounded-lg shadow-lg py-6 px-5 mt-5 pb-10 '>
          {/* avatar part  */}
          <div className='flex flex-col space-y-1'>
            <ImagePicker defaultImage={baseUrl + avatar || userDp} setFile={setFile} />
            <Title text=' Profile Photo' />
          </div>
          {/* general information */}
          <div>
            <Title
              text='General Information'
              className='flex justify-start space-x-2 items-center font-NunitoSans font-semibold border-b-2 pb-2 pt-6'
              textStyle='text-text-xs text-gray-900'
              onPress={() => setIsGenEdit((pre) => !pre)}
            />
            <form onSubmit={handleSubmit(genHandle)} className='py-5 w-[80%] m-auto space-y-4'>
              <TextInput
                register={register('name')}
                placeholder='Full Name'
                label='Name'
                disabled={!isGenEdit}
              />
              <TextInput
                register={register('email')}
                placeholder='Email'
                label='Email'
                disabled={!isGenEdit}
              />
              {isGenEdit && (
                <div className='flex space-x-2 justify-center'>
                  <ButtonCom className='w-20' borderOutline text='Cancel' btnType='button' onClick={() => setIsGenEdit(false)} />
                  <ButtonCom className='w-20' text='Save' btnType='submit' onClick={() => { }} loading={isLoading} />
                </div>
              )}
            </form>
            <Security />
          </div>
        </div>

        {/* delete account */}
        <div className='bg-white md:w-[70%] w-[90%] rounded-lg shadow-lg mt-10 px-4 pb-10'>
          <Title
            text='Delete my account'
            className='flex justify-start space-x-2 items-center font-NunitoSans font-semibold border-b-2 pb-2 pt-3 mb-5'
            textStyle='text-text-xs text-gray-900'
            iconNone
          />
          <p className='text-gray-600 font-NunitoSans text-sm pb-2'>Deleting your account removes all your content and saved items</p>
          <ButtonCom className=' bg-red-400 text-sm hover:bg-red-500' text='Delete My Account' loading={deleting} onClick={() => setIsOpen(true)} />
        </div>
      </div>
    </div>
  );
}

export default Setting;
