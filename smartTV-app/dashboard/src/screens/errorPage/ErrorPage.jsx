import { useNavigate } from 'react-router-dom';
import notFoundImg from '../../assets/errorNotFound.svg';

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className='fixed h-screen w-screen top-0 left-0 flex justify-center items-center p-10 flex-col'>
      <img src={notFoundImg} alt='404 Not Found' />
      <h1 className='pt-10 text-3xl text-tints-800 text-center'>404 NOT FOUND </h1>
      <button className='bg-tints-900 text-white font-[600] p-2 rounded my-5' onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
