import { Outlet } from 'react-router-dom';

/**
 * @returns authentication body
 */
function Auth() {
  return (
    <div className='h-[100vh] overflow-y-auto overflow-x-hidden'>
      <Outlet />
    </div>
  );
}

export default Auth;
