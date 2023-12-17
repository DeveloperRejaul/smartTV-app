import { createSlice } from '@reduxjs/toolkit';
import { AZAN_NEV_SCREEN } from '../constants/constants';

const azan = createSlice({
  name: 'azan',
  initialState: {
    screen: AZAN_NEV_SCREEN.AZAN_COUNTDOWN,
  },
  reducers: {
    /**
     * @description update azan slide with screen name
     * @param {*} state
     * @param {string} payload screen name
     */
    azanNev: (state, { payload }) => { state.screen = payload; },
  },
});
export const { azanNev } = azan.actions;
export default azan.reducer;
