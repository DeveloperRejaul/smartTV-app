import React, { useState } from 'react';
import ButtonCom from '../../../components/button/buttonCom';
import ImageCard from '../../../components/card/ImageCard';
import Modal from '../../../components/modal/Modal';

function ContentFile() {
  const [file, setFile] = useState({});

  return (
    <div className=''>
      <div className='flex border-b-2 pb-2'>
        <ButtonCom text='Media' className='bg-white w-32 hover:bg-white' textStyle='text-gray-900' />
        <ButtonCom filePick leftIconClass='stroke-white' setFile={setFile} text='Upload File' className='w-36 flex items-center justify-evenly' />
      </div>

      {/* card images part */}
      <div className='grid grid-cols-3 gap-x-5 gap-y-4 mt-5'>
        {/* {data.images.map((e) => (<ImageCard key={Math.random()} url={e.url} name={e.name} />))} */}
      </div>
    </div>
  );
}

export default ContentFile;
