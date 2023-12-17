import { createSlice } from '@reduxjs/toolkit';
import { proxyToNormal } from '../../../utils/utils.fn';

const org = createSlice({
  name: 'org',
  initialState: {
    orgs: [],
    orgNum: '',
    page: '',
  },
  reducers: {
    setOrg: (state, { payload }) => {
      state.orgs = payload?.orgs;
      state.orgNum = payload?.orgNum;
      state.page = payload?.page;
      state.prevPage = payload?.prevPage;
      state.nextPage = payload?.nextPage;
    },
    handleOrgUpdate: (state, { payload }) => {
      const id = payload?.id;
      const data = state.orgs?.map((d) => (d.id === id ? payload : d));
      state.orgs = data;
    },
    handleDeleteOrg: (state, { payload }) => {
      const id = payload?._id;
      const data = state.orgs?.filter((d) => d.id !== id);
      state.orgs = data;
      state.orgNum -= 1;
    },
    handleAddNewOrg: (state, { payload }) => {
      const prevuesData = proxyToNormal(state.orgs);
      const newData = prevuesData.slice(0, 9);
      state.orgs = [payload, ...newData];
      state.orgNum += 1;
    },
  },
});

export const { setOrg, handleOrgUpdate, handleDeleteOrg, handleAddNewOrg } = org.actions;
export default org.reducer;
