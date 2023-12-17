import { toast } from 'react-toastify';
import { sortBy, userType } from '../../../constants/constants';
import { dateFormat } from '../../../utils/stringOpration';
import { handleAddNewAdmin, handleAdminUpdate, handleDeleteAdmin, setAdmin } from '../admin/adminSlice';
import { handleAddNewOwner, handleDeleteOwner, handleOwnerUpdate, setOwner } from '../owner/ownerSlice';
import { setUser } from '../user/userSlice';
import { handleAddNewUser, handleDeleteUser, handleUserUpdate, setUsers } from '../users/usersSlice';
import { api } from './api';

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // get all user number
    getAllNumberOfUser: builder.query({
      query: () => 'user?paginate=false',
      transformResponse: (res) => {
        const { supperAdmins, owners, admins, users } = res || {};
        const totalUser = supperAdmins + owners + admins;
        return { owners, admins, screen: users, users: totalUser };
      },
    }),

    //= ============ handle masjid owner =====================
    // get masjid owners
    getMasjidOwner: builder.query({
      query: (page = 1, sort = sortBy.asc) => `user/${userType.masjidOwner}?page=${page}&sortBy=name:${sort}`,
      transformResponse: (res) => {
        const owners = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        return { owners, ownerNum: res?.totalDocs, page: res?.page, nextPage: res?.nextPage, prevPage: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setOwner(data));
        } catch (error) {
          //console.log(`from get owner api ${error}`);
        }
      },
    }),

    // create masjid owner
    createMasjidOwner: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: 'user',
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAddNewOwner(data));
          toast.success('Create Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Create Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from create owner api ${error}`);
        }
      },
    }),

    // delete masjid owner
    deleteMasjidOwner: builder.mutation({
      query: (id) => ({
        method: 'delete',
        url: `user/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleDeleteOwner(data));
          toast.success('Delete Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Delete Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from delete owner api ${error}`);
        }
      },
    }),

    // update masjid owner
    updateMasjidOwner: builder.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `user/${id}`,
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleOwnerUpdate(data));
          toast.success('Update Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Update Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from update org api ${error}`);
        }
      },

    }),

    //= ============ handle masjid admin =====================
    // get masjid admin
    getMasjidAdmin: builder.query({
      query: (page = 1, sort = sortBy.asc) => `user/${userType.admin}?page=${page}&sortBy=name:${sort}`,
      transformResponse: (res) => {
        const admins = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        return { admins, adminNum: res?.totalDocs, page: res?.page, nextPage: res.nextPage, prevPage: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdmin(data));
        } catch (error) {
          //console.log(`from get admin api ${error}`);
        }
      },
    }),

    // delete masjid admin
    deleteMasjidAdmin: builder.mutation({
      query: (id) => ({
        method: 'delete',
        url: `user/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleDeleteAdmin(data));
          toast.success('Delete Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Delete Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from delete owner api ${error}`);
        }
      },
    }),

    // create masjid admin
    createMasjidAdmin: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: 'user',
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAddNewAdmin(data));
          toast.success('Create Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Create Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from create admin api ${error}`);
        }
      },

    }),

    // find admin user by org id
    getUserByOrgId: builder.query({
      query: (id) => `user/organization/${id}?paginate=true&userType=${userType.admin}`,

      transformResponse: (res) => {
        const admins = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        return { admins, adminNum: res?.totalDocs, page: res?.page, prevPage: res.prevPage, nextPage: res.nextPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdmin(data));
        } catch (error) {
          //console.log(`from get admin api ${error}`);
        }
      },

    }),

    // update masjid admin
    updateMasjidAdmin: builder.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `user/${id}`,
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAdminUpdate(data));
          toast.success('Update Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Update Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from update admin api ${error}`);
        }
      },

    }),

    //= ============ handle masjid users =====================
    // get masjid users
    getMasjidUser: builder.query({
      query: (page = 1, sort = sortBy.asc) => `user/${userType.user}?page=${page}&sortBy=name:${sort}`,
      transformResponse: (res) => {
        const users = res?.docs.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        return { users, userNum: res?.totalDocs, page: res.page, nextPage: res.nextPage, prevPage: res.prevPage, data: 'lalala' };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data));
        } catch (error) {
          //console.log(`from get users api ${error}`);
        }
      },
    }),

    // delete masjid users
    deleteMasjidUser: builder.mutation({
      query: (id) => ({
        method: 'delete',
        url: `user/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleDeleteUser(data));
          toast.success('Delete Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Delete Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from delete users api ${error}`);
        }
      },
    }),

    // create masjid user
    createMasjidUser: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: 'user',
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleAddNewUser(data));
          toast.success('Create Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Create Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from create user api ${error}`);
        }
      },

    }),

    // update masjid user
    updateMasjidUser: builder.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `user/${id}`,
        body,
      }),
      transformResponse: (res) => ({
        id: res._id,
        masjidName: res?.org?.name ? res?.org?.name : '--',
        masjidLocation: res?.org?.location ? res?.org?.location : '--',
        regDate: dateFormat(res?.createdAt),
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleUserUpdate(data));
          toast.success('Update Successful', { position: toast.POSITION.TOP_RIGHT });
        } catch (error) {
          toast.error('Update Failed', { position: toast.POSITION.TOP_RIGHT });
          //console.log(`from update user api ${error}`);
        }
      },

    }),

    // find user by org id for user type
    getUserByOrgIdForUserType: builder.query({
      query: (id) => `user/organization/${id}?paginate=true&userType=${userType.user}`,

      transformResponse: (res) => {
        const users = res?.docs?.map((d) => ({
          id: d._id,
          masjidName: d?.org?.name ? d?.org?.name : '--',
          masjidLocation: d?.org?.location ? d?.org?.location : '--',
          regDate: dateFormat(d?.createdAt),
          name: d.name,
          email: d.email,
          avatar: d.avatar,
        }));
        return { users, userNum: res?.totalDocs, page: res.page, nextPage: res.nextPage, prev: res.prevPage };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data));
        } catch (error) {
          //console.log(`from get admin api ${error}`);
        }
      },

    }),

    //= ============ handle login user =====================
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `user/${id}`,
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          //console.log(`from update user api ${error}`);
        }
      },
    }),

    // delete masjid user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
    }),

    // update user password
    updateUserPass: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: 'user/password',
        body,
      }),
    }),

    // ======== use all screen ===================
    findUserOrgIdForChange: builder.query({
      query: (id) => `user/organization/${id}`,
      transformResponse: (res) => res?.filter((d) => d.userType === userType.user),
    }),

  }),
});

export const {
  useGetAllNumberOfUserQuery,
  useGetMasjidOwnerQuery,
  useCreateMasjidOwnerMutation,
  useLazyGetMasjidOwnerQuery,
  useDeleteMasjidOwnerMutation,
  useUpdateMasjidOwnerMutation,
  useGetMasjidAdminQuery,
  useLazyGetMasjidAdminQuery,
  useDeleteMasjidAdminMutation,
  useUpdateMasjidAdminMutation,
  useCreateMasjidAdminMutation,
  useGetMasjidUserQuery,
  useLazyGetMasjidUserQuery,
  useDeleteMasjidUserMutation,
  useCreateMasjidUserMutation,
  useUpdateMasjidUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserPassMutation,
  useGetUserByOrgIdQuery,
  useGetUserByOrgIdForUserTypeQuery,
} = userApi;
