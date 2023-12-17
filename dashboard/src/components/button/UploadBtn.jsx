import React from 'react';
import { UploadIcon } from '../../assets/svg-icon';

/**
 * @description
 * @param text string data type
 * @param onClick callback function
 * @param loading boolean data type
 * @param className string data type, tailwind class name
 * @param path string data type
 * @param buttonType string data type
 * @param icon boolean data type
 * @param btnClass string data type
 * @param borderOutline boolean data type
 * @param filePick boolean data type
 * @returns jsx Button Component
 */

export default function UploadBtn({ className, leftIconClass, setFile, text, textStyle }) {
  const handleChoiceFile = () => document.getElementById('fileInput')?.onclick();
  const handleFileChange = (event) => {
    const selectFile = event.target.files[0];
    if (selectFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectFile);
      reader.onload = () => {
        setFile({ url: reader.result, file: selectFile });
      };
    }
  };

  return (
    <div>
      <label
        onClick={handleChoiceFile}
        htmlFor='fileInput'
        className={` ${className} text-base h-7 rounded px-1 w-16 justify-center bg-tints-900 cursor-pointer`}
      >
        <UploadIcon className={leftIconClass} />
        <span className={textStyle || 'text-white'}>
          { text}
        </span>
      </label>
      <input
        type='file'
        name='choice photo'
        id='fileInput'
        className='hidden w-full'
        onChange={handleFileChange}
      />
    </div>
  );
}
