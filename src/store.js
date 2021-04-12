import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import logger from "redux-logger";

import { loginReducer } from "features/login/loginSlice";
import { translateReducer } from "features/translate/translateSlice";

const reducer = {
  login: loginReducer,
  engines: translateReducer,
};

const middleware = [...getDefaultMiddleware(), logger];

export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});
