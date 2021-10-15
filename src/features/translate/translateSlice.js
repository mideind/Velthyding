import { createSlice } from "@reduxjs/toolkit";

export const translateSlice = createSlice({
  name: "translation",
  initialState: {
    sourceLang: "en",
    targetLang: "is",
  },
  reducers: {
    switchLanguage: (state, _action) => ({
      ...state,
      sourceLang: state.targetLang,
      targetLang: state.sourceLang,
    }),
  },
});

export const translateReducer = translateSlice.reducer;
export const { switchLanguage } = translateSlice.actions;
