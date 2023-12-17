import { Outlet } from 'react-router-dom';
import SideBar from '../../components/sidebar/SideBar';
import HeaderCom from '../../components/header/Header';
import { colors } from '../../constants/colors';

function Main() {
  return (
    <div className='flex justify-between overflow-hidden'>
      <div className='w-4/12 lg:w-1/6 hidden md:block'>
        <SideBar />
      </div>
      <div className='w-full lg:w-5/6 md:w-10/12 '>
        <HeaderCom />
        <div
          className='h-[90vh] overflow-y-auto overflow-x-hidden'
          style={{ backgroundColor: colors.bgDes }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Main;

