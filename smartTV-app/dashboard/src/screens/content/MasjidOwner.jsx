import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDeleteContentMutation,
  useGetContentByOrgIdQuery,
} from '../../rtk/features/api/content.api';
import Welcome from '../../components/welcome/Welcome';
import ButtonCom from '../../components/button/buttonCom';
import { navPath } from '../../constants/navPath';
import TableCom from '../../components/table/TableCom';
import { baseUrl } from '../../constants/constants';
import { setContent } from '../../rtk/features/content/contentSlice';
import useHandleSearch from '../../hook/useHandleSearch';
import useFetch from '../../hook/useFetch';

export default function MasjidOwner() {
  document.title=`${import.meta.env.VITE_APP_TITLE} | CONTENT`;
  const { org } = useSelector((s) => s.user);
  const { refetch } = useGetContentByOrgIdQuery(org);
  const navigate = useNavigate();
  const [deleteContent] = useDeleteContentMutation();
  const { contents, page, contentNum, nextPage, prevPage } = useSelector(
    (s) => s.content,
  );
  const dispatch = useDispatch();
  const { handleInputChange } = useHandleSearch('content');
  const { onFetch } = useFetch();
  const fetchData = (pageNo = 1) => {
    fetch(`${baseUrl}content?org=${org}&page=${pageNo}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        dispatch(
          setContent({
            contentNum: data?.totalDocs,
            contents: data?.docs?.map((d) => ({
              id: d?._id,
              name: d?.org?.name,
              location: d?.org?.location,
              type: d?.type,
              waqto: d?.waqto || '--',
              action: 'action',
              orgId: d?.org?._id,
              time: d?.startTime || '',
            })),
            page: data?.page,
            nextPage: data.nextPage,
            prevPage: data.prevPage,
          }),
        );
      });
  };

  useEffect(() => {
    refetch(org);
  }, []);
  return (
    <div className='px-10 pt-7 '>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between '>
        <Welcome text='Content' />
        <div className='flex justify-end pt-5 sm:pt-0'>
          <ButtonCom
            text='Create new Content'
            icon
            className=' flex justify-between gap-4 font-NunitoSans oSans font-semibold'
            btnClass='w-5 h-5 rounded-sm  '
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
        handleNext={() => {
          nextPage !== null ? fetchData(nextPage) : '';
        }}
        handlePrevious={() => {
          prevPage !== null ? fetchData(prevPage) : '';
        }}
        page={page}
        onSearch={handleInputChange}
        onSort={async () => await onFetch(`content/${org}`, page)}
        hideSort
      />
    </div>
  );
}

