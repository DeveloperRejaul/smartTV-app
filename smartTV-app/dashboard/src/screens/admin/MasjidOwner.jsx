import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteMasjidAdminMutation, useGetUserByOrgIdQuery, useLazyGetMasjidAdminQuery } from '../../rtk/features/api/user.api';
import { colors } from '../../constants/colors';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import adminItems from './adminItems.json';
import useFetch from '../../hook/useFetch';
import { userType } from '../../constants/constants';

function MasjidOwner() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | MASJID ADMIN`;
  const { org } = useSelector((s) => s.user);
  useGetUserByOrgIdQuery(org);
  const [getMasjidAdmin] = useLazyGetMasjidAdminQuery();
  const [deleteMasjidAdmin] = useDeleteMasjidAdminMutation();
  const navigate = useNavigate();
  const { admins, adminNum, page, nextPage, prevPage } = useSelector((state) => state.admin);

  const { onFetch } = useFetch();

  return (
    <div className='flex flex-1 px-10 pt-7 flex-col space-y-6' style={{ backgroundColor: colors.bgDes }}>
      {/* header part */}
      <div className='flex flex-col sm:flex-row sm:justify-between'>
        <Welcome text='Admin' />
        <div className='flex justify-end pt-5 sm:pt-0'>
          <ButtonCom
            text='Create new Admin '
            className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold'
            icon
            btnClass='w-5 h-5 rounded-sm '
            onClick={() => navigate(navPath.adminCreate)}
          />
        </div>
      </div>
      {/* Table Part  */}
      <TableCom
        titles={adminItems.titles}
        items={admins || []}
        totalItems={adminNum}
        handleDelete={(id) => deleteMasjidAdmin(id)}
        handleEdit={(obj) => navigate(navPath.adminCreate, { state: obj })}
        onSort={async () => await onFetch('user', page, userType.admin)}
        headerHidden
        handleNext={() => { nextPage!==null?getMasjidAdmin(nextPage):''; }}
        handlePrevious={() => { prevPage!==null?getMasjidAdmin(prevPage):''; }}
        page={page}
      />

    </div>
  );
}

export default MasjidOwner;
