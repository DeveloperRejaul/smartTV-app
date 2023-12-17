import { createSlice } from '@reduxjs/toolkit';

const screen = createSlice({
  name: 'screen',
  initialState: {
    screen: {},
    blinksBeforeAzan: 0,
  },
  reducers: {
    /**
     * this function store all of screen name:boolean
     * this screen name using for off on screen
     * @param {object} state
     * @param {object} payload
     */
    updateScreen: (state, { payload }) => { state.screen = payload; },

    /**
     * this function store all of next prayer blink time set
     * time using for blink animation stay time
     * @param {object} state
     * @param {object} payload
     */
    updateBlink: (state, { payload }) => { state.blinksBeforeAzan = payload; },
  },
});
export const { updateScreen, updateBlink } = screen.actions;
export default screen.reducer;
