import { createSlice } from '@reduxjs/toolkit';
import { proxyToNormal } from '../../../utils/utils.fn';

const owner = createSlice({
  name: 'owners',
  initialState: {
    owners: [],
    ownerNum: '',
    page: '',
    prevPage: null,
    nextPage: null,
  },
  reducers: {
    setOwner: (state, { payload }) => {
      state.owners = payload?.owners;
      state.ownerNum = payload?.ownerNum;
      state.page = payload?.page;
      state.prevPage = payload?.prevPage;
      state.nextPage = payload?.nextPage;
    },
    handleOwnerUpdate: (state, { payload }) => {
      const id = payload?.id;
      const data = state.owners?.map((d) => (d.id === id ? payload : d));
      state.owners = data;
    },
    handleDeleteOwner: (state, { payload }) => {
      const id = payload?._id;
      const data = state.owners?.filter((d) => d.id !== id);
      state.owners = data;
      state.ownerNum -= 1;
    },
    handleAddNewOwner: (state, { payload }) => {
      const prevuesData = proxyToNormal(state.owners);
      const newData = prevuesData.slice(0, 9);
      state.owners = [payload, ...newData];
      state.ownerNum += 1;
    },
  },
});

export const { setOwner, handleAddNewOwner, handleDeleteOwner, handleOwnerUpdate } = owner.actions;
export default owner.reducer;
