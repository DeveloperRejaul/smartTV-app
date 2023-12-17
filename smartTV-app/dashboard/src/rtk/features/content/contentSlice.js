import { createSlice } from '@reduxjs/toolkit';
import { proxyToNormal } from '../../../utils/utils.fn';

const content = createSlice({
  name: 'content',
  initialState: {
    contents: [],
    contentNum: '',
    page: '',
    totalImage: '',
    totalVideo: '',
    nextPage: null,
    prevPage: null,
  },
  reducers: {
    setContent: (state, { payload }) => {
      state.contents = payload?.contents;
      state.contentNum = payload?.contentNum;
      state.page = payload?.page;
      state.nextPage = payload?.nextPage;
      state.prevPage = payload?.prevPage;
    },
    handleContentUpdate: (state, { payload }) => {
      const id = payload?.id;
      const data = state.contents?.map((d) => (d.id === id ? payload : d));
      state.contents = data;
    },
    handleDeleteContent: (state, { payload }) => {
      const id = payload?._id;
      const data = state.contents?.filter((d) => d.id !== id);
      state.contents = data;
      state.contentNum -= 1;
    },
    handleAddNewContent: (state, { payload }) => {
      const prevuesData = proxyToNormal(state.contents);
      const newData = prevuesData.slice(0, 9);
      state.contents = [payload, ...newData];
      state.contentNum += 1;
    },
    handleTotalContent: (state, { payload }) => {
      state.totalImage = payload.totalImage;
      state.totalVideo = payload.totalVideo;
    },
  },
});

export const { handleAddNewContent, handleContentUpdate, handleDeleteContent, setContent, handleTotalContent } = content.actions;
export default content.reducer;
