import { createSlice } from "@reduxjs/toolkit";

export const languageSettingSlice = createSlice({
  name: "languageSetting",
  initialState: {
    lang: window.navigator.language.includes("is") ? "is" : "en",
  },
  reducers: {
    changeLanguage: (state, action) => ({
      ...state,
      lang: action.payload,
    }),
  },
});

export const languageSettingReducer = languageSettingSlice.reducer;
export const { changeLanguage } = languageSettingSlice.actions;
