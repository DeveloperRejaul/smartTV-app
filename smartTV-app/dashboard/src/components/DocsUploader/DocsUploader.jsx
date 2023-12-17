import uuid from 'react-uuid';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TrashIcon from '../../assets/svg-icon/trash.svg';
import audioIcon from '../../assets/audio-file.png';
import videoIcon from '../../assets/play.png';

export default function DocsUploader({ thumbnails = [], callBack = () => {}, type='sudio' }) {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState({});
  useLayoutEffect(() => {
    if (thumbnails.length > 0) {
      setImages({});
      thumbnails.forEach((item) => {
        setImages((prev) => ({ ...prev, [uuid()]: { src: item.src, name: item.name } }));
      });
    }
  }, []);

  useEffect(() => {
    callBack(images);
  }, [images]);

  const handleFile = (e) => {
    if (e.target.files[0]) setImages((prev) => ({ ...prev, ...{ [uuid()]: { src: e.target.files[0], name: e.target.files[0].name } } }));
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
          className={`bg-slate-100/50 h-[100px] w-[150px] rounded border-dashed border flex justify-center items-center flex-col cursor-pointer ${Object.keys(images).length<1?'block':'hidden'}`}
          onClick={() => fileInputRef.current.click()}>
          <span>+</span>
          Upload
        </div>
        {Object.keys(images).map((key, index) => (
          <div
            key={index}
            className='w-[150px]'
          >
            <div
              className='h-[100px] w-[150px] rounded  relative group border shadow-md flex justify-center items-center'>
              <img src={type==='audio'? audioIcon:videoIcon} alt={type} className='h-[50px] w-[45px]' />
              <div className='bg-black-50/50 absolute top-0 left-0 right-0 bottom-0 rounded hidden group-hover:block'>
                <div className='h-full w-full  flex justify-center items-center'>
                  <img src={TrashIcon} alt='Delete' className='cursor-pointer' onClick={() => handleDelete(key)} />
                </div>
              </div>
            </div>
            <p className='line-clamp-1'>
              {images[key].name}
            </p>
          </div>
        ))}
      </div>

      <input
        className='hidden'
        type='file'
        ref={fileInputRef}
        onChange={handleFile}
        accept={type==='audio'? '.mp3': type==='video'? '.mp4, .mkv': '*'}
      />
    </div>
  );
}
