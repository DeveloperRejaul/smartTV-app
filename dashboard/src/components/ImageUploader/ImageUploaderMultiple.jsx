import uuid from 'react-uuid';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TrashIcon from '../../assets/svg-icon/trash.svg';
import { baseUrl } from '../../constants/constants';

export default function ImageUploaderMultiple({ thumbnails = [], callBack = () => {}, limit=1 }) {
  const fileInputRef2 = useRef(null);
  const [images, setImages] = useState({});
  useLayoutEffect(() => {
    if (thumbnails.length > 0) {
      setImages({});

      thumbnails.forEach((item) => {
        setImages((prev) => ({ ...prev, [uuid()]: item }));
      });
    }
  }, [thumbnails]);

  useEffect(() => {
    callBack(images);
  }, [images]);

  const handleFile = (e) => {
    if (e.target.files[0]) setImages((prev) => ({ ...prev, ...{ [uuid()]: e.target.files[0] } }));
  };

  const renderImage = (key) => {
    const res = typeof images[key] === 'string' ? baseUrl + images[key] : URL.createObjectURL(images[key]);
    return res;
  };
  const handleDelete = (key) => {
    setImages((prev) => {
      delete prev[key];
      return { ...prev };
    });
  };

  return (
    <div>
      <div className='flex items-center gap-4 flex-wrap pt-5'>
        <div
          className={`bg-slate-100/50 h-[100px] w-[150px] rounded border-dashed border flex justify-center items-center flex-col cursor-pointer ${Object.keys(images).length<limit?'block':'hidden'}`}
          onClick={() => fileInputRef2.current.click()}
        >
          <span>+</span>
          Upload
        </div>
        {Object.keys(images).map((key, index) => (
          <div
            key={index}
            className='h-[100px] w-[150px] rounded  relative group'>
            <img
              src={renderImage(key)}
              className='w-full h-full rounded'
              alt='thumbnail'
            />
            <div className='bg-black-50/50 absolute top-0 left-0 right-0 bottom-0 rounded hidden group-hover:block'>
              <div className='h-full w-full  flex justify-center items-center'>
                <img src={TrashIcon} alt='Delete' className='cursor-pointer' onClick={() => handleDelete(key)} />
                {/* <TrashIcon
                  className='text-white  text-2xl cursor-pointer'
                  onClick={() => handleDelete(key)}
                /> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        className='hidden'
        type='file'
        ref={fileInputRef2}
        onChange={handleFile}
        accept='.jpg, .png, .jpeg'
      />
    </div>
  );
}
