import React from 'react';
import Welcome from '../../../components/welcome/Welcome';
import ContentBtn from './ContentBtn';
import ContentFile from './ContentFile';

function Content() {
  return (
    <div className='p-5 h-screen '>
      <div className=' flex justify-between  h-1/5'>
        <Welcome />
        <ContentBtn />
      </div>
      <ContentFile />
    </div>
  );
}

export default Content;
