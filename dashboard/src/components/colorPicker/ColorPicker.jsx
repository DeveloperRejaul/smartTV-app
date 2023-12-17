import { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import colorPickerIcon from '../../assets/color-picker.png';

export default function ColorPicker({ color='#FFFFFF', callBack = () => {}, setValue = () => {}, name='colorPicker' }) {
  const modalRef= useRef();
  const [hexValue, setHaxValue]= useState('');
  const [sketchPickerColor, setSketchPickerColor] = useState({
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  });
  const [isOpen, setIsopen]=useState(false);

  function hexToRgba(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((s) => s + s)
        .join('');
    }
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    const rgba = `rgba(${red}, ${green}, ${blue}, 1)`;

    return rgba;
  }
  useEffect(() => {
    setValue(name, color);
    setHaxValue(color);
    const [r, g, b, a]= hexToRgba(color).slice(5, -1).split(',');
    setSketchPickerColor({ r, g, b, a });
  }, [color]);

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
    <div className='relative'>
      <div className='flex items-center gap-5'>
        <img onClick={() => setIsopen((prev) => !prev)} src={colorPickerIcon} alt='Choose Color' className='w-[25px]' />
        <div style={{ height: '30px', width: '100px', backgroundColor: hexValue, borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eeeeee', margin: '5px 0' }}>
          {hexValue}
        </div>

      </div>
      {
        isOpen===true? (
          <div className='absolute bottom-0 left-0' ref={modalRef}>
            <SketchPicker
              onChange={(colors) => {
                callBack(colors.hex);
                setSketchPickerColor(colors.rgb);
                setValue(name, colors.hex);
                setHaxValue(colors.hex);
              }}
              color={sketchPickerColor}
            />
          </div>
        )
          :''
      }
    </div>
  );
}
