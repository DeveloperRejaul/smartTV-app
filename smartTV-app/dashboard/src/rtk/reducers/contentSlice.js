import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'createContent',
  initialState: {
    images: {},
  },
  reducers: {
    setData: (state, { payload }) => {
      state[payload.target]= payload.value;
    },
  },
});

export const { setData } = contentSlice.actions;
export default contentSlice.reducer;
