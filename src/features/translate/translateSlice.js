import { createSlice } from "@reduxjs/toolkit";

function updateTranslation(translateState, action) {
  return {
    ...translateState,
    text: action.payload.text,
    structuredText: action.payload.structuredText,
  };
}

export const translateSlice = createSlice({
  name: "translation",
  initialState: {
    selected: true,
    // TODO: Do we need to set the text and structuredText? What are their funcions?
    textOnly: false,
    sourceLang: "en",
    targetLang: "is",
  },
  reducers: {
    setTranslation: updateTranslation,
    clear: (state, _action) => ({
      ...state,
      text: [],
    }),
    switchLanguage: (state, _action) => ({
      ...state,
      sourceLang: state.targetLang,
      targetLang: state.sourceLang,
    }),
  },
});

export const translateReducer = translateSlice.reducer;
export const { setTranslation, clear, switchLanguage } = translateSlice.actions;
