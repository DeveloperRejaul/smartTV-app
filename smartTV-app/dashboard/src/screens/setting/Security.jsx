import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import TextInput from '../../components/textInput/TextInput';
import { validation } from '../../utils/Validation';
import { cleanEmptyObjValue } from '../../utils/utils.fn';
import { useUpdateUserPassMutation } from '../../rtk/features/api/user.api';
import ButtonCom from '../../components/button/buttonCom';
import Title from './Title';

function Security() {
  const [isSecEdit, setIsSecEdit] = useState(false);
  const { handleSubmit, register, setError, reset, clearErrors, formState: { errors } } = useForm();
  const [updatePass, { isLoading, isError, isSuccess }] = useUpdateUserPassMutation();
  const { id } = useSelector((state) => state.user) || {};

  useEffect(() => {
    if (isError)toast.error(`${'Something wrong'}`, { position: toast.POSITION.TOP_LEFT });
    if (isSuccess) {
      toast.success(`${'Change Success'}`, { position: toast.POSITION.TOP_LEFT });
      reset();
    }
  }, [isError, isSuccess]);

  const secHandle = (data) => {
    const { message } = validation.checkPass(data.password);
    const { message: conMes } = validation.checkConfirmPass(data.conPassword);
    if (message) {
      setError('password', { type: 'manual', message });
      toast.error(message);
      return;
    }
    if (conMes) {
      setError('conPassword', { type: 'manual', message: conMes });
      toast.error(conMes);
      return;
    }
    const errorExist = message || conMes;
    const dataObj = cleanEmptyObjValue({ id, oldPassword: data.oldPassword, newPassword: data.password });
    if (!errorExist) {
      updatePass(dataObj);
    }
  };

  return (

    <>
      <Title
        text='Security'
        className='flex justify-start space-x-2 items-center font-NunitoSans font-semibold border-b-2 pb-2 pt-6'
        textStyle='text-text-xs text-gray-900'
        onPress={() => setIsSecEdit((pre) => !pre)}
      />
      <form className='py-5 w-[80%] m-auto space-y-4' onSubmit={handleSubmit(secHandle)}>
        <TextInput
          register={register('oldPassword', { required: true })}
          placeholder='Password'
          label={isSecEdit ? 'Old Password ' : 'Password'}
          disabled={!isSecEdit}
          icon
          type='password'
        />
        {isSecEdit && (
          <>
            <TextInput
              register={register('password', { required: true })}
              placeholder='Password'
              label='New Password'
              disabled={!isSecEdit}
              error={errors?.password?.message}
              icon
              type='password'
            />
            <TextInput
              register={register('conPassword', { required: true })}
              placeholder='Password'
              label='Confirm Password'
              disabled={!isSecEdit}
              error={errors?.conPassword?.message}
              icon
              type='password'
            />
            <div className='flex space-x-2 justify-center'>
              <ButtonCom className='w-20' borderOutline text='Cancel' btnType='button' onClick={() => setIsSecEdit(false)} />
              {/* <ButtonCom className='w-20' text='Save' btnType='submit' onClick={() => reset()} loading={isLoading} /> */}
              <ButtonCom className='w-20' text='Save' btnType='submit' onClick={() => clearErrors()} loading={isLoading} />
            </div>
          </>
        )}
      </form>
    </>
  );
}

export default Security;
