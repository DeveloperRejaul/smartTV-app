import { TableEdit } from '../../assets/svg-icon';

export default function Title({ text, className, textStyle, iconNone, onPress }) {
  return (
    <div className={className || ' flex space-x-2 justify-center'}>
      <p className={`text-gray-900 ${textStyle || 'text-sm'}`}>{text}</p>
      {iconNone || <TableEdit className='stroke-tints-500 w-5 h-5 cursor-pointer' onClick={onPress} />}
    </div>
  );
}
