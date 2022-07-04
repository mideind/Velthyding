import { createSlice } from "@reduxjs/toolkit";

export const translateSlice = createSlice({
  name: "translation",
  // TODO: Load this from local storage
  initialState: {
    sourceLang: "en",
    targetLang: "is",
  },
  reducers: {
    swapLanguages: (state, _action) => ({
      ...state,
      sourceLang: state.targetLang,
      targetLang: state.sourceLang,
    }),
    setSourceLanguage: (state, action) => ({
      ...state,
      sourceLang: action.payload,
    }),
    setTargetLanguage: (state, action) => ({
      ...state,
      targetLang: action.payload,
    }),
  },
});

export const translateReducer = translateSlice.reducer;
export const { swapLanguages, setSourceLanguage, setTargetLanguage } =
  translateSlice.actions;
