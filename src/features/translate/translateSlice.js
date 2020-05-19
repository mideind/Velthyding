import { createSlice } from '@reduxjs/toolkit';

import { ENGINES } from 'config';


function updateTranslation(translateState, action) {
  return translateState.map((engine) => {
    if (engine.name === action.payload.name) {
      return { ...engine, txt: action.payload.text };
    }
    return engine;
  });
}

function toggle(translateState, action) {
  return translateState.map((engine) => {
    console.log({ ...engine });
    if (engine.name === action.payload) {
      console.log('HIT', engine.selected);
      console.log(!engine.selected);
      return { ...engine, selected: !engine.selected, txt: [] };
    }
    return engine;
  });
}

function clear(translateState, action) {
  return translateState.map((engine) => ({ ...engine, txt: [] }));
}

const storeEngines = ENGINES.map((e) => ({ ...e, txt: [] }));
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
