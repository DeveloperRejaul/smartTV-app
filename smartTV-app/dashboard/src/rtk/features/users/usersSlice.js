import { createSlice } from '@reduxjs/toolkit';
import { proxyToNormal } from '../../../utils/utils.fn';

const user = createSlice({
  name: 'users',
  initialState: {
    users: [],
    userNum: '',
    page: '',
    nextPage: null,
    prevPage: null,
  },
  reducers: {
    setUsers: (state, { payload }) => {
      state.users = payload?.users;
      state.userNum = payload?.userNum;
      state.page = payload?.page;
      state.prevPage = payload?.prevPage;
      state.nextPage = payload?.nextPage;
    },
    handleUserUpdate: (state, { payload }) => {
      const id = payload?.id;
      const data = state.users?.map((d) => (d.id === id ? payload : d));
      state.users = data;
    },
    handleDeleteUser: (state, { payload }) => {
      const id = payload?._id;
      const data = state.users?.filter((d) => d.id !== id);
      state.users = data;
      state.userNum -= 1;
    },
    handleAddNewUser: (state, { payload }) => {
      const prevuesData = proxyToNormal(state.users);
      const newData = prevuesData.slice(0, 9);
      state.users = [payload, ...newData];
      state.userNum += 1;
    },
  },
});

export const { setUsers, handleUserUpdate, handleDeleteUser, handleAddNewUser } = user.actions;
export default user.reducer;
