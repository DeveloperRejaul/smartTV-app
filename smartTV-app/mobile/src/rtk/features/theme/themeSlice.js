import { createSlice } from '@reduxjs/toolkit';

const theme = createSlice({
  name: 'theme',
  initialState: {
    colors: {},
    fonts: {},
  },
  reducers: {
    /**
     * @description this function using for update colors
     * @param {object} state
     * @param {object} payload
     */
    updateColors: (state, { payload }) => { state.colors = payload; },

    /**
     * @description this function using for update fonts
     * @param {object} state
     * @param {object} payload
     */
    updateFonts: (state, { payload }) => { state.fonts = payload; },
  },
});
export const { updateColors, updateFonts } = theme.actions;
export default theme.reducer;
