import { createSlice } from '@reduxjs/toolkit';

const auth = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isLoading: true,
    token: true,
  },
  reducers: {
    login: (state) => { state.isLogin = true; },
    logout: (state) => { state.isLoading = false; },
    handleLoading: (state, { payload }) => { state.isLoading = payload; },
    handleToken: (state, { payload }) => { state.token = payload; },
  },
});

export const { login, logout, handleLoading, handleToken } = auth.actions;
export default auth.reducer;
