import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import uq from '@umalqura/core';
import { getCurrentTime } from '../../../utils/timeConvater';
import { hijiriMonthName } from '../../../constants/constants';

const clock = createSlice({
  name: 'clock',
  initialState: {
    currentTime: getCurrentTime(),
    currentDate: moment().format('DD MMM YYYY'),
    currentHijriDate: '00 00 00',
  },
  reducers: {

    /**
     * @description this function using for update time
     * @param {object} state
     * @param {*} param1
     */
    updateTime: (state, { payload }) => { state.currentTime = payload; },

    /**
     * @description this function using for update date
     * @param {object} state
     * @param {*} param1
     */
    updateDate: (state, { payload }) => {
      const date = new Date();
      date.setDate(payload > 0 ? date.getDate() + Math.abs(payload) : date.getDate() - Math.abs(payload));
      const hijiri = uq(date);
      // const engDate = moment(date).format('DD MMM YYYY');

      // update state
      state.currentDate = moment().format('DD MMM YYYY'),
      state.currentHijriDate = `${hijiri.hd} ${hijiriMonthName[hijiri.hm]} ${hijiri.hy}`;
    },
  },
});

export const { updateTime, updateDate } = clock.actions;
export default clock.reducer;
