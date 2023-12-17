import { toast } from 'react-toastify';
import { api } from './api';
import { sortBy } from '../../../constants/constants';
import { handleAddNewContent, handleContentUpdate, handleDeleteContent, handleTotalContent, setContent } from '../content/contentSlice';

export const contentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // get all contents
    getAllContent: builder.query({
      query: (page = 1, sort = sortBy.asc) => `content?page=${page}&sortBy=name:${sort}`,
      transformResponse: (res) => {
        const contents = res?.docs?.map((d) => ({ id: d?._id, name: d?.org?.name, location: d?.org?.location, type: d?.type, waqto: d?.waqto || '--', action: 'action', days: d?.days, dateRange: d?.dateRange, layout: d?.layout, fileName: d?.fileName, time: d?.startTime, src: d?.src, zone: d?.zone, audioSrc: d?.audioSrc, audioFileName: d?.audioFileName, endTime: d?.endTime, slidePhotos: d?.slidePhotos, slideType: d?.slideType, eventName: d?.eventName }));
        return { contentNum: res?.totalDocs, contents, page: res?.page, totalImage: res.totalImage, totalVideo: res.totalVideo, totalUrl: res.totalUrl, nextPage: res.nextPage, prevPage: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setContent(data));
          dispatch(handleTotalContent({ totalImage: data.totalImage, totalVideo: data.totalVideo }));
        } catch (error) {
          //console.log(`from get content api ${error}`);
        }
      },
    }),

    // creating contents
    createContent: builder.mutation({
      query: (body) => ({
        url: 'content',
        method: 'POST',
        body,
      }),
      transformResponse: (d) => ({ id: d?._id, name: d?.org?.name, location: d?.org?.location, type: d?.type, waqto: d?.waqto || '--', action: 'action', orgId: d?.org?._id, time: d?.startTime || '', endTime: d?.endTime, slidePhotos: d?.slidePhotos, slideType: d?.slideType, eventName: d?.eventName }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAddNewContent(data));
          toast.success('Successfully Created', { position: toast.POSITION.TOP_RIGHT });
          setTimeout(() => { window.location.href = '/content'; }, 1000);
        } catch (error) {
          //console.log(error);
          if (error?.error?.originalStatus === 413) toast.error('Network Error', { position: toast.POSITION.TOP_RIGHT });
          else toast.error(error?.error?.data, { position: toast.POSITION.TOP_RIGHT });
        }
      },

    }),

    // delete content
    deleteContent: builder.mutation({
      query: (id) => ({
        method: 'delete',
        url: `content/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleDeleteContent(data));
          toast.success('Delete Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          //console.log(`from delete org api ${error}`);
          toast.error('Delete Field', { position: toast.POSITION.TOP_RIGHT });
        }
      },
    }),

    // update content
    updateContent: builder.mutation({
      query: ({ body, id }) => ({
        method: 'PUT',
        url: `content/${id}`,
        body,
      }),
      transformResponse: (d) => ({ id: d?._id, name: d?.org?.name, location: d?.org?.location, type: d?.type, waqto: d?.waqto || '--', action: 'action', time: d?.startTime || '', endTime: d?.endTime || '', slidePhotos: d?.slidePhotos, slideType: d?.slideType, eventName: d?.eventName }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleContentUpdate(data));
          toast.success('Update Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          //console.log(error);
          if (error?.error?.originalStatus === 413) toast.error('Network Error', { position: toast.POSITION.TOP_RIGHT });
          else toast.error(error?.error?.data, { position: toast.POSITION.TOP_RIGHT });
        }
      },
    }),

    // get content by org id
    getContentByOrgId: builder.query({
      query: (id) => `content/${id}`,
      transformResponse: (res) => {
        const contents = res?.docs?.map((d) => ({ id: d?._id, name: d?.org?.name, location: d?.org?.location, type: d?.type, waqto: d?.waqto || '--', action: 'action', days: d?.days, dateRange: d?.dateRange, layout: d?.layout, fileName: d?.fileName, time: d?.startTime, src: d?.src, zone: d?.zone, audioSrc: d?.audioSrc, audioFileName: d?.audioFileName, endTime: d?.endTime, slidePhotos: d?.slidePhotos, slideType: d?.slideType, eventName: d?.eventName }));

        return { contentNum: res?.totalDocs, contents, page: res?.page, nextPage: res.nextPage, prevPage: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setContent(data));
        } catch (error) {
          //console.log(`from get content api ${error}`);
        }
      },
    }),
  }),
});

export const {
  useGetAllContentQuery,
  useCreateContentMutation,
  useLazyGetAllContentQuery,
  useDeleteContentMutation,
  useUpdateContentMutation,
  useGetContentByOrgIdQuery,
} = contentApi;
