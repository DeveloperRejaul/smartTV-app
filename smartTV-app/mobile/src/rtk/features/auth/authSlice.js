import { createSlice } from '@reduxjs/toolkit';

const auth = createSlice({
  name: 'auth',
  initialState: { isLogin: false },
  reducers: {

    /**
     * @description this function using for login user
     * @param {*} state
     */
    handleLogin: (state) => { state.isLogin = true; },

    /**
     * @description this function using for logout user
     * @param {*} state
     */
    handleLogout: (state) => { state.isLogin = false; },
  },
});

export const { handleLogin, handleLogout } = auth.actions;
export default auth.reducer;
