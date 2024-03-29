import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "user",
  initialState: {
    loggedin: false,
    email: null,
    hoverId: null,
  },
  reducers: {
    login: (state, action) => ({
      ...state,
      email: action.payload,
      loggedin: true,
    }),
    logout: (state, action) => ({
      ...state,
      email: action.payload,
      loggedin: false,
    }),
  },
});

export const loginReducer = loginSlice.reducer;
export const { login, logout } = loginSlice.actions;
