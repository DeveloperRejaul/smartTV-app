import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function ImagePicker({ setFile, defaultImage, orgName='', stateAltImgName=null }) {
  const [imageError, setImageError] = useState(false);
  const [fileUri, setFileUri] = useState('');
  const { name }= useSelector((state) => state.user);
  const { pathname }= useLocation();

  const handleChoiceFile = () => document.getElementById('fileInput').onclick();
  const handleFileChange = (event) => {
    const selectFile = event.target.files[0];
    if (selectFile) {
      setImageError(false);
      setFile(selectFile);
      setFileUri(URL.createObjectURL(selectFile));
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <label
        className='w-20 h-20 bg-grays-100 rounded-xl flex justify-center items-center overflow-hidden cursor-pointer'
        onClick={handleChoiceFile}
        htmlFor='fileInput'
      >
        {
          imageError? (
            <div className='text-tints-700 font-[600] text-2xl uppercase'>{pathname.includes('/organization')? orgName.slice(0, 3): stateAltImgName? stateAltImgName: name.slice(0, 2)}</div>
          )
            :(
              <img
                className='object-cover h-full w-full'
                src={fileUri || defaultImage}
                alt='profile'
                onError={() => setImageError(true)}
              />
            )
        }
      </label>
      <input
        type='file'
        name='choice photo'
        id='fileInput'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImagePicker;
