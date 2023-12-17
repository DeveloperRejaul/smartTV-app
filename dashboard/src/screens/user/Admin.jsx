import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteMasjidUserMutation, useGetUserByOrgIdForUserTypeQuery, useLazyGetMasjidUserQuery } from '../../rtk/features/api/user.api';
import useFetch from '../../hook/useFetch';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import userItems from './userItems.json';
import { userType } from '../../constants/constants';
import { colors } from '../../constants/colors';

export default function Admin() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  MASJID USER`;

  const navigate = useNavigate();
  const { org } = useSelector((s) => s.user);
  useGetUserByOrgIdForUserTypeQuery(org);
  const [getMasjidUsers] = useLazyGetMasjidUserQuery();
  const [deleteUser] = useDeleteMasjidUserMutation();
  const { users, userNum, page, nextPage, prevPage } = useSelector((state) => state.users);
  const { onFetch } = useFetch();

  return (
    <div className='flex flex-1 px-10 pt-7 flex-col space-y-6' style={{ backgroundColor: colors.bgDes }}>
      {/* header part */}
      <div className='flex flex-col sm:flex-row sm:justify-between'>
        <Welcome />
        <div className='flex justify-end pt-5 sm;pt-0'>
          <ButtonCom
            text='Create User '
            className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold'
            icon
            btnClass='w-5 h-5 rounded-sm '
            onClick={() => navigate(navPath.userCreate)}
          />
        </div>
      </div>

      {/* Table Part  */}
      <TableCom
        titles={userItems.title}
        items={users || []}
        handleEdit={(obj) => navigate(navPath.userCreate, { state: obj })}
        totalItems={userNum}
        handleDelete={(id) => deleteUser(id)}
        onSort={async () => await onFetch('user', page, userType.user)}
        headerHidden
        handleNext={() => { nextPage!==null?getMasjidUsers(nextPage):''; }}
        handlePrevious={() => { prevPage!==null?getMasjidUsers(prevPage):''; }}
        page={page}
      />
    </div>
  );
}
