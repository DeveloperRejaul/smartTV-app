import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/api';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import orgReducer from '../features/org/orgSlice';
import ownerReducer from '../features/owner/ownerSlice';
import adminReducer from '../features/admin/adminSlice';
import usersReducer from '../features/users/usersSlice';
import contentReducer from '../features/content/contentSlice';
import createContentReducer from '../reducers/contentSlice';

export const store = configureStore({
  reducer: {
    org: orgReducer,
    user: userReducer,
    auth: authReducer,
    owner: ownerReducer,
    admin: adminReducer,
    users: usersReducer,
    content: contentReducer,
    createContent: createContentReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});
