import { createBrowserRouter } from 'react-router-dom';
import Main from '../screens/Main/Main';
import Login from '../screens/login/Login';
import Auth from '../screens/auth/Auth';
import SignUp from '../screens/signup/Signup';
import Protected from './protected';
import { navPath } from '../constants/navPath';
import FindMail from '../screens/forgetPassword/FindMail';
import NotFound from '../screens/forgetPassword/NotFound';
import NewPassword from '../screens/forgetPassword/NewPassword';
import Home from '../screens/home/Home';
import Organization from '../screens/organization/index';
import Admin from '../screens/admin/index';
// eslint-disable-next-line import/no-unresolved, import/extensions
import UserCreate from '../screens/user/UserCreate';
import User from '../screens/user/Index';
import MasjidAdmin from '../screens/masjidAdmin/MasjidAdmin';
import CreateOrganization from '../screens/organization/CreateOrganization';
import CreateMasjidOwner from '../screens/masjidAdmin/CreateMasjidOwner';
import CreateAdmin from '../screens/admin/CreateAdmin';
import Setting from '../screens/setting/Setting';
import ContentList from '../screens/content';
import CreateContent from '../screens/content/CreateContent';
import OtpVerification from '../screens/forgetPassword/OtpVerification';
import ErrorPage from '../screens/errorPage/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      // Dash board part start
      {
        path: navPath.dashboard,
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },

      // Organization part start
      {
        path: navPath.organization,
        element: (
          <Protected>
            <Organization />
          </Protected>
        ),
      },
      {
        path: navPath.orgCreate,
        element: (
          <Protected>
            <CreateOrganization />
          </Protected>
        ),
      },

      // Content part start
      {
        path: navPath.content,
        element: (
          <Protected>
            <ContentList />
          </Protected>
        ),
      },
      {
        path: navPath.createContent,
        element: (
          <Protected>
            <CreateContent />
          </Protected>
        ),
      },
      // Owner part start
      {
        path: navPath.masjidAdmin,
        element: (
          <Protected>
            <MasjidAdmin />
          </Protected>
        ),
      },
      {
        path: navPath.ownerCreate,
        element: (
          <Protected>
            <CreateMasjidOwner />
          </Protected>
        ),
      },

      // Admin part start
      {
        path: navPath.admin,
        element: (
          <Protected>
            <Admin />
          </Protected>
        ),
      },
      {
        path: navPath.adminCreate,
        element: (
          <Protected>
            <CreateAdmin />
          </Protected>
        ),
      },

      // User part start
      {
        path: navPath.user,
        element: (
          <Protected>
            <User />
          </Protected>
        ),
      },
      {
        path: navPath.userCreate,
        element: (
          <Protected>
            <UserCreate />
          </Protected>
        ),
      },

      // Setting
      {
        path: navPath.setting,
        element: (
          <Protected>
            <Setting />
          </Protected>
        ),
      },
    ],
  },

  // Authentication part start
  {
    path: navPath.auth,
    element: <Auth />,
    children: [
      {
        path: navPath.login,
        element: <Login />,
      },
      // {
      //   path: navPath.signUp,
      //   element: <SignUp />,
      // },
      {
        path: navPath.findMail,
        element: <FindMail />,
      },
      {
        path: navPath.notFound,
        element: <NotFound />,
      },
      {
        path: navPath.verifyOtp,
        element: <OtpVerification />,
      },
      {
        path: navPath.newPassword,
        element: <NewPassword />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
