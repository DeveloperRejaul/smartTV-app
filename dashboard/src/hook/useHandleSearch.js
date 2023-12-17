import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, userType } from '../constants/constants';
import { dateFormat } from '../utils/stringOpration';
import { setUsers } from '../rtk/features/users/usersSlice';
import { setAdmin } from '../rtk/features/admin/adminSlice';
import { setOwner } from '../rtk/features/owner/ownerSlice';
import { setContent } from '../rtk/features/content/contentSlice';
import { setOrg } from '../rtk/features/org/orgSlice';

let handleSearchTimeout;

export default (url) => {
  const dispatch = useDispatch();
  const { userType: userRole, org } = useSelector((state) => state.user);

  const handleSearch = async (data) => {
    try {
      // handle user search
      if (url === `user/${userType.user}`) {
        const result = await fetch(`${baseUrl}${url}?search=${data}`, { credentials: 'include' });
        const res = await result.json();
        const users = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        const userRes = { users, userNum: res?.totalDocs, page: res?.page };
        dispatch(setUsers(userRes));
      }

      // handle user admin type
      if (url === `user/${userType.admin}`) {
        const result = await fetch(`${baseUrl}${url}?search=${data}`, { credentials: 'include' });
        const res = await result.json();
        const admins = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        const adminsRes = { admins, adminNum: res?.totalDocs, page: res?.page };
        dispatch(setAdmin(adminsRes));
      }

      // handle masjid owner
      if (`user/${userType.masjidOwner}`) {
        const result = await fetch(`${baseUrl}${url}?search=${data}`, { credentials: 'include' });
        const res = await result.json();
        const owners = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        const ownersRes = { owners, ownerNum: res?.totalDocs, page: res?.page };
        dispatch(setOwner(ownersRes));
      }

      // handle content
      if (url === 'content') {
        const result = await fetch(`${baseUrl}${url}${userRole !== 'supper-admin' ? '/' + org : ''}?search=${data}`, { credentials: 'include' });
        const res = await result.json();
        const contents = res?.docs?.map((d) => ({ id: d?._id, name: d?.org?.name, location: d?.org?.location, type: d?.type, waqto: d?.waqto || '--', action: 'action' }));
        const contentRes = { contentNum: res?.totalDocs, contents, page: res?.page };
        dispatch(setContent(contentRes));
      }

      // handle organization
      if (url === 'organization') {
        const result = await fetch(`${baseUrl}${url}?search=${data}`, { credentials: 'include' });
        const res = await result.json();
        const orgs = res?.docs?.map((d) => ({ id: d._id, name: d.name, location: d.location, timeFormat: d.timeFormat, timeZone: d.timezone, avatar: d.avatar }));
        const orgRes = { orgNum: res?.totalDocs, orgs, page: res?.page };
        dispatch(setOrg(orgRes));
      }
    } catch (error) {
      //console.log('🚀 ~ file: useHandleSearch.js:12 ~ handleSearch ~ error:', error);
    }
  };

  // this is debouncing function , its call when user typing stope
  const handleInputChange = (value) => {
    clearTimeout(handleSearchTimeout);
    handleSearchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  return { handleInputChange };
};
