import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { loginReducer } from "features/login/loginSlice";
import { translateReducer } from "features/translate/translateSlice";
import logger from "redux-logger";

const reducer = {
  login: loginReducer,
  translation: translateReducer,
};

const middleware = [...getDefaultMiddleware(), logger];

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});
