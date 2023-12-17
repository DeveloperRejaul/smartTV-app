import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useDeleteContentMutation,
  useGetContentByOrgIdQuery,
  useLazyGetAllContentQuery,
} from '../../rtk/features/api/content.api';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';

export default function Admin() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | CONTENT`;
  const { org } = useSelector((s) => s.user);
  const { refetch } = useGetContentByOrgIdQuery(org);
  const navigate = useNavigate();
  const [deleteContent] = useDeleteContentMutation();
  const [getContents] = useLazyGetAllContentQuery();
  const { contents, page, contentNum, nextPage, prevPage } = useSelector(
    (s) => s.content,
  );
  useEffect(() => {
    refetch(org);
  }, []);

  return (
    <div className='px-10 pt-7'>
      <div className='flex flex-col sm:flex-row  sm:items-center sm:justify-between pb-5'>
        <Welcome text='Content' />
        <div className='flex justify-end pt-5 sm:pt-0'>
          <ButtonCom
            text='Create new Content'
            icon
            className='flex justify-between gap-4 font-NunitoSans oSans font-semibold'
            btnClass='h-6'
            onClick={() => {}}
            path={navPath.createContent}
          />
        </div>
      </div>
      <TableCom
        titles={[
          ' Content Id',
          'Masjid Name',
          'Masjid Location',
          'Content Type',
          'Waktu',
          'Action',
        ]}
        items={contents || []}
        totalItems={contentNum}
        handleDelete={(id) => deleteContent(id)}
        handleEdit={(obj) => navigate(navPath.createContent, { state: obj })}
        headerHidden
        handleNext={() => { nextPage!==null?getContents(nextPage):''; }}
        handlePrevious={() => { prevPage!==null?getContents(prevPage):''; }}
        page={page}
      />
    </div>
  );
}

