import { toast } from 'react-toastify';
import { sortBy } from '../../../constants/constants';
import { handleAddNewOrg, handleDeleteOrg, handleOrgUpdate, setOrg } from '../org/orgSlice';
import { api } from './api';

export const orgApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    /**
     * Get all organization data in hare
     */
    getAllOrg: builder.query({
      query: (page = 1, sort = sortBy.asc) => `organization?page=${page}&sortBy=name:${sort}`,
      transformResponse: (res) => {
        const orgs = res?.docs?.map((d) => ({
          id: d._id,
          name: d.name,
          location: d.location,
          timeFormat: d.timeFormat,
          timeZone: d.timezone,
          avatar: d.avatar,
          mute: d.mute,
          runningText: d.runningText,
          runningTextShow: d.runningTextShow,
          sleepingDate: d.sleepingDate,
          sleepingDay: d.sleepingDay,
          theme: d?.theme,
          offset: d?.offset,
          blinksBeforeAzan: d?.blinksBeforeAzan,
          screen: d?.screen,
          adjustment: d?.adjustment,

        }));
        return { orgNum: res?.totalDocs, orgs, page: res?.page, nextPage: res.nextPage, prevPage: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setOrg(data));
        } catch (error) {
          //console.log(`from get org api ${error}`);
        }
      },
    }),

    /**
    * delete single by organization id in hare
    */
    deleteOrg: builder.mutation({
      query: (id) => ({
        method: 'delete',
        url: `organization/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleDeleteOrg(data));
          toast.success('Delete successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Delete Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from delete org api ${error}`);
        }
      },
    }),

    /**
    * update single by organization id in hare
    */
    updateOrg: builder.mutation({
      query: ({ body, id }) => ({
        method: 'PUT',
        url: `organization/${id}`,
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        name: res.name,
        location: res.location,
        timeFormat: res.timeFormat,
        timeZone: res.timezone,
        avatar: res.avatar,
        mute: res.mute,
        runningText: res.runningText,
        runningTextShow: res.runningTextShow,
        sleepingDate: res.sleepingDate,
        sleepingDay: res.sleepingDay,
        theme: res?.theme,
        offset: res?.offset,
        blinksBeforeAzan: res?.blinksBeforeAzan,
        screen: res?.screen,
        adjustment: res?.adjustment,

      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleOrgUpdate(data));
          toast.success('Update successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Update Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from update org api ${error}`);
        }
      },
    }),

    /**
    * create organization in hare
    */
    createOrg: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: 'organization',
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        name: res.name,
        location: res.location,
        timeFormat: res.timeFormat,
        timeZone: res.timezone,
        avatar: res.avatar,
        mute: res.mute,
        runningText: res.runningText,
        runningTextShow: res.runningTextShow,
        sleepingDate: res.sleepingDate,
        sleepingDay: res.sleepingDay,
        theme: res?.theme,
        offset: res?.offset,
        blinksBeforeAzan: res?.blinksBeforeAzan,
        screen: res?.screen,
        adjustment: res?.adjustment,

      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAddNewOrg(data));
          toast.success('Create successful', { position: toast.POSITION.TOP_RIGHT });
          // window.location.href = '/organization/create';
        } catch (error) {
          toast.error('Create Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from create org api ${error}`);
        }
      },
    }),

    // get org by org id
    getOrgById: builder.query({
      query: (id) => `organization/${id}`,
      transformResponse: (d) => {
        const orgs = [
          {
            id: d._id,
            name: d.name,
            location: d.location,
            timeFormat: d.timeFormat,
            timeZone: d.timezone,
            avatar: d.avatar,
            mute: d.mute,
            runningText: d.runningText,
            runningTextShow: d.runningTextShow,
            sleepingDate: d.sleepingDate,
            sleepingDay: d.sleepingDay,
            theme: d.theme,
            offset: d?.offset,
            blinksBeforeAzan: d?.blinksBeforeAzan,
            screen: d?.screen,
            adjustment: d?.adjustment,
          },
        ];
        return { orgs };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setOrg(data));
        } catch (error) {
          //console.log(`from update org api ${error}`);
        }
      },
    }),

  }),
});

export const {
  useGetAllOrgQuery,
  useDeleteOrgMutation,
  useUpdateOrgMutation,
  useCreateOrgMutation,
  useLazyGetAllOrgQuery,
  useGetOrgByIdQuery,
  useLazyGetOrgByIdQuery,
} = orgApi;
