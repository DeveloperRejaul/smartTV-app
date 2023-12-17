import { createSlice } from '@reduxjs/toolkit';
import { navigationType, prayerNavigation, syurukNavigation } from '../../../constants/constants';

const navigation = createSlice({
  name: 'navigation',
  initialState: {
    screen: navigationType.HOME,
    prayer: prayerNavigation.AZAN_COUNTDOWN,
    syuruk: syurukNavigation.COUNDOWN,

    // SLIDER STATE
    slider: '',
    pending: false,

    azanIqomahGap: null,
  },
  reducers: {
    /**
     * @description this function using for update navigation
     * @param {string} payload navigationType object value
     * @param {object} state
     */
    updateNavigation: (state, { payload }) => { state.screen = payload; },

    /**
     * @description this function using for update prayer navigation screen
     * @param {string} payload prayerNavigation object value
     * @param {object} state
     */
    updatePrayerNavigation: (state, { payload }) => { state.prayer = payload; },

    /**
     * @description this function using for update syuruk navigation screen
     * @param {string} payload syurukNavigation object value
     * @param {object} state
     */
    updateSyurukNavigation: (state, { payload }) => { state.syuruk = payload; },

    /**
     * @description this function using for update slider navigation screen
     * @param {string} payload syurukNavigation object value
     * @param {object} state
     */
    updateSliderNavigation: (state, { payload }) => { state.prayer = payload; },

    /**
     * @description this function using for slide stop start
     * @param {boolean} payload boolean value
     * @param {object} state
     */
    stopSlide: (state, { payload }) => { state.pending = payload; },

    /**
     * @description this function using for azan-iqomah gap time handle
     * @param {*} state
     * @param {*} param1
     */
    handleAzanIqomahGap: (state, { payload }) => { state.azanIqomahGap = payload; },
  },
});

export const { updateNavigation, updatePrayerNavigation, stopSlide, updateSyurukNavigation, handleAzanIqomahGap } = navigation.actions;
export default navigation.reducer;
