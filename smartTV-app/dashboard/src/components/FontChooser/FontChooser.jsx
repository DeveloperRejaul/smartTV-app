import { useEffect, useRef, useState } from 'react';
import { Down } from '../../assets/svg-icon';

export default function FontChooser({ data= [], defaultValue=null, name='fontName', setValue = () => {} }) {
  const [isOpen, setIsopen]=useState(false);
  const [selected, setSelected] = useState(null);
  const modalRef = useRef();
  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
      const isFound= data.find((item) => item.value===defaultValue);
      if (isFound) setSelected(isFound);
    }
  }, [defaultValue]);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsopen(false);
      }
    };
    isOpen
      ? document.addEventListener('mousedown', handleOutsideClick)
      : document.removeEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className='relative min-w-[200px]  w-full' ref={modalRef}>
      <div className='border rounded p-2 flex items-center justify-between w-full cursor-pointer ' onClick={() => setIsopen(true)}>
        {selected? <p className={selected.style}>{selected?.name}</p>:'Select'}
        <div className='w-5 h-4 bg-gray-200 rounded flex justify-center items-center cursor-pointer'>
          <Down className='fill-gray-600' />
        </div>
      </div>
      {
        isOpen===true
          ?(
            <div className='absolute top-0 left-0 w-full divide-y bg-white rounded border  max-h-[200px] min-h-max overflow-y-scroll shadow z-10'>
              {
                data.map((d, index) => <div className={`p-2 ${d.style} cursor-pointer hover:bg-tints-200 `} key={index} onClick={() => { setIsopen(false); setSelected(d); setValue(name, d.value); }}>{d?.name}</div>)
              }
            </div>
          )
          :''
      }
    </div>
  );
}
