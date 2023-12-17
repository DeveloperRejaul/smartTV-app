import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo/Logo';
import { navPath } from '../../constants/navPath';
import NavLinkCom from '../navLink/NavLink';
import {
  Admin,
  Content,
  DashBoard,
  Organization,
  Owner,
  Users,
  Setting,
  Logout,
} from '../../assets/svg-icon';
import { useLogoutMutation } from '../../rtk/features/api/auth.api';
import { userType } from '../../constants/constants';
import { useAppContext } from '../../context/context';

/**
 * @returns  dashboard side bar component
 */

function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutReq] = useLogoutMutation();
  const { userType: user } = useSelector((state) => state.user);
  const { socket } = useAppContext();

  const handleLogout = () => {
    socket.disconnect();
    navigate(navPath.login);
    dispatch(logoutReq());
  };

  return (
    <nav
      style={{ height: '100vh', zIndex: 20 }}
      className='bg-white  border-r shadow-gray-300 font-NunitoSans'
    >
      <div className='flex justify-center items-center py-4'>
        <Logo />
      </div>

      <div className='space-y-3 overflow-y-scroll h-[calc(100vh-113.266px)] scrollbar '>
        {/* Dashboard */}
        <NavLinkCom
          title='Dashboard'
          end={false}
          children={<DashBoard className='text-lg ' />}
          path={navPath.dashboard}
        />

        {/* Organization */}
        <NavLinkCom
          title='Organization'
          end={false}
          children={<Organization className='text-lg' />}
          path={navPath.organization}
        />

        {/* Content */}
        <NavLinkCom
          title='Content'
          end={false}
          children={<Content className='text-lg' />}
          path={navPath.content}
        />

        {/* Masjid Admin Owner */}
        {user === userType.masjidOwner || user === userType.admin ? null : (
          <NavLinkCom
            title='Masjid Owner'
            end={false}
            children={<Owner className='text-lg' />}
            path={navPath.masjidAdmin}
          />
        )}

        {/* Admin */}
        {user !== userType.admin && (
          <NavLinkCom
            title='Admin'
            end={false}
            children={<Admin className='text-lg' />}
            path={navPath.admin}
          />
        )}

        {/* Users */}
        <NavLinkCom
          title='Users'
          end={false}
          children={<Users className='text-lg' />}
          path={navPath.user}
        />

        {/* Setting */}
        <NavLinkCom
          title='Settings'
          end={false}
          children={<Setting className='h-6 w-6' />}
          path={navPath.setting}
        />
        {/* Logout */}
        <div
          className='flex px-2 space-x-2 text-tints-900 cursor-pointer'
          onClick={handleLogout}>
          <Logout className='h-6 w-6' />
          <p>Log Out</p>
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
