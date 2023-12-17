import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl, sortBy, userType } from '../constants/constants';
import { dateFormat } from '../utils/stringOpration';
import { setUsers } from '../rtk/features/users/usersSlice';
import { setAdmin } from '../rtk/features/admin/adminSlice';
import { setOwner } from '../rtk/features/owner/ownerSlice';
import { setOrg } from '../rtk/features/org/orgSlice';
import { setContent } from '../rtk/features/content/contentSlice';

export default () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [isAsc, setIsAsc] = useState(false);
  const dispatch = useDispatch();

  /**
   * @param {string} url fetch url
   * @param {string} page number og page
   * @param {string} type user type
   */
  const onFetch = async (url, page, type) => {
    setIsAsc((pre) => !pre);
    const typeParam = type ? `/${type}` : '';
    const sortOn = url === 'content' ? 'type' : 'name';

    try {
      setLoading(true);
      const result = await fetch(`${baseUrl}${url}${typeParam}?page=${page}&sortBy=${sortOn}:${isAsc ? sortBy.asc : sortBy.desc}`, { credentials: 'include' });
      const res = await result.json();
      // handle masjid user data
      if (type === userType.user) {
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
        setData(userRes);
      }

      // handle masjid admin
      if (type === userType.admin) {
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
        setData(adminsRes);
      }

      // handle masjid owner
      if (type === userType.masjidOwner) {
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
        setData(ownersRes);
      }

      // handle organization
      if (url === 'organization') {
        const orgs = res?.docs?.map((d) => ({
          id: d._id,
          name: d.name,
          location: d.location,
          timeFormat: d.timeFormat,
          timeZone: d.timezone,
          avatar: d.avatar,
        }));
        const orgRes = { orgNum: res?.totalDocs, orgs, page: res?.page };
        dispatch(setOrg(orgRes));
        setData(orgRes);
      }

      // handle content
      if (url === 'content') {
        const contents = res?.docs?.map((d) => ({
          id: d?._id,
          name: d?.org?.name,
          location: d?.org?.location,
          type: d?.type,
          waqto: d?.waqto || '--',
          action: 'action',
        }));
        const contentRes = { contentNum: res?.totalDocs, contents, page: res?.page };
        dispatch(setContent(contentRes));
        setData(contentRes);
      }
      setLoading(false);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError(err);
    }
  };

  return { isLoading, isError, error, isSuccess, data, onFetch };
};
