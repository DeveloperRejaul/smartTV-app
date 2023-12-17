import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteOrgMutation,
  useGetAllOrgQuery,
  useLazyGetAllOrgQuery,
} from '../../rtk/features/api/org.api';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import orgItems from './orgItems.json';
import { colors } from '../../constants/colors';
import useFetch from '../../hook/useFetch';
import useHandleSearch from '../../hook/useHandleSearch';

function SupperAdmin() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | ORGANIZATION`;
  const navigate = useNavigate();
  const { refetch } = useGetAllOrgQuery();
  const [deleteData] = useDeleteOrgMutation();
  const { orgs, orgNum, page, nextPage, prevPage } = useSelector(
    (state) => state.org,
  );
  const [getOrgData] = useLazyGetAllOrgQuery();
  const { onFetch } = useFetch();
  const { handleInputChange } = useHandleSearch('organization');

  useEffect(() => {
    refetch();
  }, []);
  return (
    <div
      className='flex flex-1 px-10 pt-7 flex-col space-y-6'
      style={{ backgroundColor: colors.bgDes }}
    >
      {/* header part */}
      <div className='flex justify-between flex-col sm:flex-row'>
        <Welcome />
        <div className='flex justify-end pt-10 sm:pt-0'>
          <ButtonCom
            text='Create Organization '
            className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold'
            icon
            btnClass='w-5 h-5 rounded-sm '
            onClick={() => navigate(navPath.orgCreate)}
          />
        </div>
      </div>

      {/* Table Part  */}
      <TableCom
        titles={orgItems.title}
        items={orgs || []}
        handleDelete={(id) => deleteData(id)}
        handleEdit={(obj) => navigate(navPath.orgCreate, { state: obj })}
        totalItems={orgNum}
        handleNext={() => {
          nextPage !== null ? getOrgData(nextPage) : '';
        }}
        handlePrevious={() => {
          prevPage !== null ? getOrgData(prevPage) : '';
        }}
        onSort={async () => await onFetch('organization', page)}
        onSearch={handleInputChange}
        page={page}
      />
    </div>
  );
}

export default SupperAdmin;

