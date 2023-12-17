import { createSlice } from '@reduxjs/toolkit';

const user = createSlice({
  name: 'user',
  initialState: {
    id: '',
    email: '',
    name: '',
    avatar: '',
    userType: '',
    org: '',
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.id = payload?._id;
      state.name = payload?.name;
      state.email = payload?.email;
      state.avatar = payload?.avatar;
      state.userType = payload?.userType;
      state.org = typeof payload?.org === 'object' ? payload?.org?._id : payload?.org;
    },
    clearUser: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.avatar = '';
      state.userType = '';
      state.org = '';
    },
  },
});

export const { setUser, clearUser } = user.actions;
export default user.reducer;
