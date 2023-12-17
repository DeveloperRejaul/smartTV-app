import React from 'react';
import { ImageIcon } from '../../assets/svg-icon';

function ImageCard({ url, name }) {
  return (
    <div className='h-52 px-4 py-3  rounded-xl cursor-pointer hover:border-2 hover:border-tints-900 image-card-shadow'>
      <div className='h-4/5 w-full'>
        <img className='object-cover  rounded h-full w-full' src={url} alt='imageData' />
      </div>
      <div className='flex items-center space-x-2'>
        <ImageIcon />
        <p className='py-2'>{ name}</p>
      </div>
    </div>
  );
}

export default ImageCard;
