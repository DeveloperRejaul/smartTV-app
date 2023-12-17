import { createSlice } from '@reduxjs/toolkit';

const user = createSlice({
  name: 'user',
  initialState: {
    id: '',
    avatar: '',
    name: '',
    location: '',
    timeFormat: '',
    slide: [],
    mute: false,
    sleepingDate: [],
    sleepingDay: [],
    runningText: '',
    runningTextShow: true,
  },
  reducers: {
    /**
     * this function call when update organization
     * @param {object} state
     * @param {Function} action
    */
    saveUser: (state, { payload }) => {
      state.id = payload?.data._id;
      state.name = payload?.data.name;
      state.location = payload?.data.location;
      state.avatar = payload?.avatar;
      state.timeFormat = payload?.data.timeFormat;
      state.sleepingDate = payload?.data.sleepingDate;
      state.sleepingDay = payload?.data.sleepingDay;
      state.mute = payload?.data.mute;
      state.runningText = payload?.data.runningText;
      state.runningTextShow = payload?.data.runningTextShow;
    },

    /**
     * this function call when delete organization
     * @param {object} state
     * @param {Function} action
    */
    deleteUser: (state) => {
      state.id = '';
      state.avatar = '';
      state.name = '';
      state.location = '';
      state.timeFormat = '';
      state.slide = [];
      state.mute = false;
      state.sleepingDate = [];
      state.sleepingDay = [];
      state.runningText = '';
      state.runningTextShow = true;
    },
  },
});

export const { saveUser, deleteUser } = user.actions;
export default user.reducer;
