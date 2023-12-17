import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteOrgMutation, useGetOrgByIdQuery } from '../../rtk/features/api/org.api';
import { colors } from '../../constants/colors';
import Welcome from '../../components/welcome/Welcome';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import orgItems from './orgItems.json';
import LoadingCom from '../../components/loading/loadingCom';
import CardPrayerTime from '../../components/card/CardPrayerTime';
import { useGetContentQuery } from '../../rtk/features/api/owner.user.api';

function MasjidOwner() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | ORGANIZATION`;
  const { org } = useSelector((s) => s.user);
  const { refetch } = useGetOrgByIdQuery(org);
  const { orgs } = useSelector((s) => s.org);
  const navigate = useNavigate();
  const [deleteData] = useDeleteOrgMutation();
  const { data: content, isLoading } = useGetContentQuery(org);
  const { time } = content || {};

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className='flex flex-1 px-10 pt-7 flex-col space-y-6' style={{ backgroundColor: colors.bgDes }}>
      {/* header part */}
      <div className='flex justify-between'>
        <Welcome />
      </div>

      {/* Table Part  */}
      <TableCom
        titles={orgItems.title}
        items={orgs || []}
        handleDelete={(id) => deleteData(id)}
        handleEdit={(obj) => navigate(navPath.orgCreate, { state: obj })}
        headerHidden
        footerHidden
        heightAuto
      />

      {/* futures parts */}
      <div>
        <h1 className='font-NunitoSans font-bold text-2xl border-b-2 mb-3 pb-3'>Prayer Time</h1>
        {isLoading && <LoadingCom />}
        <div className='flex justify-center items-center w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 text-white font-NunitoSans w-full'>
            {time?.map((e) => <CardPrayerTime data={e} key={Math.random()} />)}
          </div>
        </div>
      </div>

    </div>
  );
}

export default MasjidOwner;
