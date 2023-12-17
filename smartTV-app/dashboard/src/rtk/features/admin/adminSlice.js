import { createSlice } from '@reduxjs/toolkit';
import { proxyToNormal } from '../../../utils/utils.fn';

const admin = createSlice({
  name: 'admins',
  initialState: {
    admins: [],
    adminNum: '',
    page: '',
    nextPage: null,
    prevPage: null,
  },
  reducers: {
    setAdmin: (state, { payload }) => {
      state.admins = payload?.admins;
      state.adminNum = payload?.adminNum;
      state.page = payload?.page;
      state.nextPage = payload?.nextPage;
      state.prevPage = payload?.prevPage;
    },
    handleAdminUpdate: (state, { payload }) => {
      const id = payload?.id;
      const data = state.admins?.map((d) => (d.id === id ? payload : d));
      state.admins = data;
    },
    handleDeleteAdmin: (state, { payload }) => {
      const id = payload?._id;
      const data = state.admins?.filter((d) => d.id !== id);
      state.admins = data;
      state.adminNum -= 1;
    },
    handleAddNewAdmin: (state, { payload }) => {
      const prevuesData = proxyToNormal(state.admins);
      const newData = prevuesData.slice(0, 9);
      state.admins = [payload, ...newData];
      state.adminNum += 1;
    },
  },
});

export const { setAdmin, handleAddNewAdmin, handleDeleteAdmin, handleAdminUpdate } = admin.actions;
export default admin.reducer;
