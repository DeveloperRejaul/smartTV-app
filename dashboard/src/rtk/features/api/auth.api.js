import { toast } from 'react-toastify';
import { handleLoading, handleToken, login } from '../auth/authSlice';
import { setUser } from '../user/userSlice';
import { api } from './api';

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: 'user/login/web',
        body: data,
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(handleToken(true));
          dispatch(login());
          dispatch(setUser(data));
          dispatch(handleLoading(false));
        } catch (error) {
          toast.error(`${error?.error.data ?? 'Somthing wrong'}`, { position: toast.POSITION.TOP_LEFT });
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'user/logout',
        body: '',
        method: 'POST',
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body,
      }),
    }),
    supersignup: builder.mutation({
      query: (body) => ({
        url: 'user/super-admin',
        method: 'POST',
        body,
      }),
    }),
    mailCheckExists: builder.mutation({
      query: (body) => ({
        url: 'user/find',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: 'user/setpassword',
        method: 'POST',
        body,
      }),
    }),

    checkUserValidity: builder.mutation({
      query: () => ({
        url: 'user/check',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login());
          dispatch(handleToken(true));
          dispatch(setUser(data));
          dispatch(handleLoading(false));
        } catch (error) {
          dispatch(handleToken(false));
          //console.log(`from checkUserValidity auth api ${JSON.stringify(error)}`);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSupersignupMutation,
  useMailCheckExistsMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useCheckUserValidityMutation,
} = authApi;
