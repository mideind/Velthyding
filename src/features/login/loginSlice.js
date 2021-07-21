import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "user",
  initialState: {
    loggedin: false,
    email: null,
    source: "en",
    target: "is",
    hoverId: null,
    showGoogle: false,
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
    switchLanguage: (state, _action) => ({
      source: state.target,
      target: state.source,
    }),
    toggleGoogle: (state, _action) => ({
      ...state,
      showGoogle: !state.showGoogle,
    }),
  },
});

export const loginReducer = loginSlice.reducer;
export const {
  login,
  logout,
  switchLanguage,
  toggleGoogle,
} = loginSlice.actions;
