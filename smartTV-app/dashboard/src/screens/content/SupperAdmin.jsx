import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteContentMutation, useGetAllContentQuery, useLazyGetAllContentQuery } from '../../rtk/features/api/content.api';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import useFetch from '../../hook/useFetch';
import useHandleSearch from '../../hook/useHandleSearch';

export default function SupperAdmin() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | CONTENT`;
  const { refetch } = useGetAllContentQuery();
  const navigate = useNavigate();
  const [deleteContent] = useDeleteContentMutation();
  const [getContents] = useLazyGetAllContentQuery();
  const { contents, page, contentNum, nextPage, prevPage } = useSelector((s) => s.content);
  const { onFetch } = useFetch();
  const { handleInputChange } = useHandleSearch('content');

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className='px-10 pt-7'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <Welcome text='Content' />
        <div className='flex justify-end pt-5'>
          <ButtonCom
            text='Create new Content'
            icon
            className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold px-2'
            btnClass='w-5 h-5 rounded-sm '
            onClick={() => { }}
            path={navPath.createContent}
          />
        </div>
      </div>
      <TableCom
        titles={[' Content Id', 'Masjid Name', 'Masjid Location', 'Content Type', 'Waktu', 'Action']}
        items={contents || []}
        totalItems={contentNum}
        handleNext={() => { nextPage!==null?getContents(nextPage):''; }}
        handlePrevious={() => { prevPage!==null?getContents(prevPage):''; }}
        handleDelete={(id) => deleteContent(id)}
        handleEdit={(obj) => navigate(navPath.createContent, { state: obj })}
        onSort={async () => await onFetch('content', page)}
        onSearch={handleInputChange}
        page={page}
      />
    </div>
  );
}
