import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { categorizeUrls, offsetCalculate } from '../../../utils/utils.fn';
import { format } from '../../../utils/formatData';
import { parayerTime } from '../../../constants/constants';

const content = createSlice({
  name: 'content',
  initialState: {

    todayPrayerTimes: [{}],
    activePrayerTime: {},
    nextPrayerTime: {},
    prevuesPrayerTime: {},
    times: [],

    contents: [],
    activeContent: [],
    nextPrayerContents: [],
    prevuesPrayerContents: [],

    slides: [],
  },
  reducers: {

    /**
     * @description this function using for update prayer tine
     * @param {*} state
     * @param {*} param1
     */
    updatePrayerTime: (state, { payload }) => {
      const current = payload?.filter((d) => d.active === true);

      // find next prayer time index
      let nextIndex = payload.findIndex((d) => d.active === true) + 1;
      if (nextIndex === payload.length) nextIndex = 0;

      // find prevues prayer time index
      let prev = payload.findIndex((d) => d.active === true) - 1;
      if (prev === -1) prev = payload.length - 1;

      state.activePrayerTime = current;
      state.nextPrayerTime = payload[nextIndex];
      state.prevuesPrayerTime = payload[prev];

      // update next prayer content
      const nextPrayerName = parayerTime[payload[nextIndex]?.name];
      const nextPrayerContent = state.contents.filter((con) => con.waqto === nextPrayerName);
      state.nextPrayerContents = nextPrayerContent;

      // update prevues prayer contents
      const prevuesPrayerName = parayerTime[payload[prev]?.name];
      const prevuesPrayerContent = state.contents.filter((con) => con.waqto === prevuesPrayerName);
      state.prevuesPrayerContents = prevuesPrayerContent;
    },

    /**
     * @description this function using for update update active content
     * @param {*} state
     * @param {*} param1
     */
    updateActiveContent: (state, { payload }) => { state.activeContent = payload; },

    /**
     * @description this function using for update update time
     * @param {*} state
     * @param {*} param1
     */
    updateTimes: (state, { payload }) => { state.times = payload; },

    /**
     * @description this function using for update today time
     * @param {*} state
     * @param {*} param1
     */
    handleTodayPrayer: (state, { payload: { times, offset } }) => {
      if (Object.keys(times).length > 0) {
        const date = moment().format('DD-MMM-YYYY');
        const todayPrayer = times?.filter((d) => d.date === date)[0];
        const updatedTime = {};

        for (const key in todayPrayer) {
          if (key !== 'date') {
            updatedTime[key] = offsetCalculate(todayPrayer[key], offset[key]);
          } else {
            updatedTime[key] = todayPrayer[key];
          }
        }
        state.todayPrayerTimes = [updatedTime];
      }
    },

    /**
     * @description this function using for add content
     * @param {*} state
     * @param {*} param1
     */
    handleContents: (state, { payload }) => { state.contents = payload; },

    /**
     * @description this function using for add slides
     * @param {*} state
     * @param {*} param1
     */
    handleSlide: (state, { payload }) => { state.slides = payload; },

    /**
     * @description this function using for update slide
     * @param {*} state
     * @param {*} param1
     */
    handleUpdateSlide: (state, { payload }) => {
      const newSlide = categorizeUrls([format.slideData(payload)]);
      const slides = state.slides.filter((d) => d.id !== payload._id);
      state.slides = [...slides, ...newSlide];
    },

    /**
     * @description this function using for delete slide
     * @param {*} state
     * @param {*} param1
     */
    handleDeleteSlide: (state, { payload }) => {
      state.slides = state.slides.filter((d) => d.id !== payload._id);
    },

    /**
     * @description this function using for add new slide
     * @param {*} state
     * @param {*} param1
     */
    handleAddSlide: (state, { payload }) => {
      const formatData = format.slideData(payload);
      const newSlide = categorizeUrls([formatData]);
      state.slides = [...state.slides, ...newSlide];
    },

  },
});

export const {
  updatePrayerTime, updateActiveContent, updateLayout,
  updateTimes, handleTodayPrayer, handleContents, handleSlide,
  handleUpdateSlide, handleDeleteSlide, handleAddSlide,
} = content.actions;
export default content.reducer;
