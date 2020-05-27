import { createSlice } from '@reduxjs/toolkit';

import { ENGINES } from 'config';


function updateTranslation(translateState, action) {
  return translateState.map((engine) => {
    if (engine.name === action.payload.name) {
      return { ...engine, text: action.payload.text, structuredText: action.payload.structuredText };
    }
    return engine;
  });
}

function toggle(translateState, action) {
  return translateState.map((engine) => {
    if (engine.name === action.payload) {
      return { ...engine, selected: !engine.selected, text: [] };
    }
    return engine;
  });
}

function clear(translateState, action) {
  return translateState.map((engine) => ({ ...engine, text: [] }));
}

const storeEngines = ENGINES.map((e) => ({ ...e, text: [] }));
export const translateSlice = createSlice({
  name: 'engines',
  initialState: storeEngines,
  reducers: {
    setTranslation: updateTranslation,
    setToggle: toggle,
    clearAll: clear,
  },
});


export const translateReducer = translateSlice.reducer;
export const { setTranslation, setToggle, clearAll } = translateSlice.actions;
