import { createSlice } from '@reduxjs/toolkit';

import { ENGINES } from 'config';


function updateTranslation(translateState, action) {
    return translateState.map(engine => {
        if (engine.name === action.payload.name) {
            return {...engine, txt: action.payload.text.join("\n\n")}
        }
        return engine
    });
}

function toggle(translateState, action) {
    return translateState.map(engine => {
        if (engine.name === action.payload) {
            return {...engine, selected: !engine.selected, txt: ''}
        }
        return engine
    });
}

function clear(translateState, action) {
    return translateState.map(engine => {
        return {...engine,  txt: ''}
    });
}

const storeEngines = ENGINES.map((e) => {return { ...e, txt: '' }});
export const translateSlice = createSlice({
    name: 'engines',
    initialState: storeEngines,
    reducers: { 
        setTranslation: updateTranslation,
        setToggle: toggle,
        clearAll: clear
    },
});


export const translateReducer = translateSlice.reducer;
export const { setTranslation, setToggle, clearAll } = translateSlice.actions;