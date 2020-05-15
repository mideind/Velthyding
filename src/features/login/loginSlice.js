import { createSlice } from '@reduxjs/toolkit';


export const loginSlice = createSlice({
  name: 'user',
  initialState: {
    loggedin: false,
    email: null,
    source: 'en',
    target: 'is',
  },
  reducers: {
    login: (state, action) => ({ email: action.payload, loggedin: true }),
    logout: (state, action) => ({ email: action.payload, loggedin: false }),
    switchLanguage: (state, action) => ({ source: state.target, target: state.source }),
  },
});


export const loginReducer = loginSlice.reducer;
export const { login, logout, switchLanguage } = loginSlice.actions;
