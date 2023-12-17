import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Welcome from '../../components/welcome/Welcome';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import ButtonCom from '../../components/button/buttonCom';
import { colors } from '../../constants/colors';
import adminItems from './adminItems.json';
import { useDeleteMasjidOwnerMutation, useGetMasjidOwnerQuery, useLazyGetMasjidOwnerQuery } from '../../rtk/features/api/user.api';
import useFetch from '../../hook/useFetch';
import { userType } from '../../constants/constants';
import useHandleSearch from '../../hook/useHandleSearch';

function MasjidAdmin() {
  document.title=`${import.meta.env.VITE_APP_TITLE} |  MASJID OWNER`;

  useGetMasjidOwnerQuery();
  const [getMasjidOwner] = useLazyGetMasjidOwnerQuery();
  const [deleteMasjidOwner] = useDeleteMasjidOwnerMutation();
  const navigate = useNavigate();
  const { owners, ownerNum, page, nextPage, prevPage } = useSelector((state) => state.owner);
  const { onFetch } = useFetch();
  const { handleInputChange } = useHandleSearch(`user/${userType.masjidOwner}`);

  return (
    <div className='flex flex-1 px-10 pt-7 flex-col space-y-6' style={{ backgroundColor: colors.bgDes }}>
      {/* header part */}
      <div className='flex justify-between'>
        <Welcome text='Masjid Admin' />
        <ButtonCom
          text='Create Masjid Owner '
          className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold'
          icon
          btnClass='w-5 h-5 rounded-sm '
          onClick={() => navigate(navPath.ownerCreate)}
        />
      </div>

      {/* Table Part  */}
      <TableCom
        titles={adminItems.titles}
        items={owners || []}
        handleEdit={(obj) => navigate(navPath.ownerCreate, { state: obj })}
        totalItems={ownerNum}
        handleDelete={(id) => deleteMasjidOwner(id)}
        onSort={async () => await onFetch('user', page, userType.masjidOwner)}
        onSearch={handleInputChange}
        handleNext={() => { nextPage!==null?getMasjidOwner(nextPage):''; }}
        handlePrevious={() => { prevPage!==null?getMasjidOwner(prevPage):''; }}
        page={page}
      />

    </div>
  );
}

export default MasjidAdmin;
